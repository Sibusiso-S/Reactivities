import {
	action,
	observable,
	computed,
	reaction,
	runInAction,
	toJS,
} from 'mobx';
import { SyntheticEvent } from 'react';
import agents from '../api/agents';
import { IActivity } from '../models/activity';
import { makeObservable } from 'mobx';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { createAttendee, setActivityProps } from '../utils/utils';
import {
	HubConnection,
	HubConnectionBuilder,
	LogLevel,
} from '@microsoft/signalr';

const LIMIT = 2;

export default class ActivityStore {
	rootStore: RootStore;
	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeObservable(this);

		reaction(
			() => this.predicate.keys(),
			() => {
				this.page = 0;
				this.activityRegistry.clear();
				this.loadActivities();
			},
		);
	}

	@observable activityRegistry = new Map();
	@observable loadingInitial = false;
	@observable activity: IActivity | null = null;
	@observable submitting = false;
	@observable target = '';
	@observable loading = false;
	@observable.ref hubConnection: HubConnection | null = null;
	@observable activityCount = 0;
	@observable page = 0;
	@observable predicate = new Map();

	@action setPredicate = (predicate: string, value: string | Date) => {
		this.predicate.clear();
		if (predicate !== 'all') {
			this.predicate.set(predicate, value);
		}
	};

	@computed get axiosParams() {
		const params = new URLSearchParams();
		params.append('limit', String(LIMIT));
		params.append('offset', `${this.page ? this.page * LIMIT : 0}`);
		this.predicate.forEach((value, key) => {
			if (key === 'startDate') {
				params.append(key, value.toISOString());
			} else {
				params.append(key, value);
			}
		});
		return params;
	}

	@computed get totalPages() {
		return Math.ceil(this.activityCount / LIMIT);
	}

	@action setPage = (page: number) => {
		this.page = page;
	};

	@action createHubConnection = (activityId: string) => {
		this.hubConnection = new HubConnectionBuilder()
			.withUrl(process.env.REACT_APP_API_CHAT_URL!, {
				accessTokenFactory: () => this.rootStore.commonStore.token!,
			})
			.configureLogging(LogLevel.Information)
			.build();

		this.hubConnection
			.start()
			.then(() => console.log(this.hubConnection!))
			.then(() => {
				if (this.hubConnection!.state === 'Connected') {
					console.log('Attempting to join group');
					this.hubConnection!.invoke('AddToGroup', activityId);
				}
			})
			.catch((error) => console.log('Error establishing connection: ', error));

		this.hubConnection.on('ReceiveComment', (comment) => {
			runInAction(() => {
				this.activity!.comments.push(comment);
			});
		});

		this.hubConnection.on('Send', (message) => {
			toast.info(message);
		});
	};

	@action stopHubConnection = () => {
		this.hubConnection!.invoke('RemoveFromGroup', this.activity!.id)
			.then(() => this.hubConnection!.stop())
			.then(() => console.log('Connection stopped'))
			.catch((err) => console.log(err));
	};

	@action addComment = async (values: any) => {
		values.activityId = this.activity!.id;
		try {
			await this.hubConnection!.invoke('SendComment', values);
		} catch (error) {
			console.log(error);
		}
	};

	@computed get activitiesByDate() {
		return this.groupActivitiesByDate(
			Array.from(this.activityRegistry.values()),
		);
	}

	groupActivitiesByDate(activities: IActivity[]) {
		const sortedActivities = activities.sort(
			(a, b) => a.date.getTime() - b.date.getTime(),
		);
		return Object.entries(
			sortedActivities.reduce((activities, activity) => {
				const date = activity.date?.toISOString().split('T')[0];
				activities[date] = activities[date]
					? [...activities[date], activity]
					: [activity];
				return activities;
			}, {} as { [key: string]: IActivity[] }),
		);
	}

	@action loadActivities = async () => {
		this.loadingInitial = true;
		try {
			const activitiesEnvelope = await agents.Activities.list(this.axiosParams);
			const { activities, activityCount } = activitiesEnvelope;
			runInAction(() => {
				activities.forEach((activity) => {
					setActivityProps(activity, this.rootStore.userStore.user!);
					this.activityRegistry.set(activity.id, activity);
				});
				this.activityCount = activityCount;
				this.loadingInitial = false;
			});
		} catch (error) {
			runInAction(() => {
				this.loadingInitial = false;
			});
		}
	};

	@action loadActivity = async (id: string) => {
		let activity = this.activityRegistry.get(id);
		if (activity) {
			this.activity = activity;
			return toJS(activity);
		} else {
			this.loadingInitial = true;
			try {
				activity = await agents.Activities.details(id);
				runInAction(() => {
					setActivityProps(activity, this.rootStore.userStore.user!);
					this.activity = activity;
					this.activityRegistry.set(activity.id, activity);
					this.loadingInitial = false;
				});
				return activity;
			} catch (error) {
				runInAction(() => {
					this.loadingInitial = false;
				});
				console.log(error);
			}
		}
	};

	@action clearActivity = () => {
		this.activity = null;
	};

	getActivity = async (id: string) => {
		return this.activityRegistry.get(id);
	};

	@action createActivity = async (activity: IActivity) => {
		this.submitting = true;
		try {
			await agents.Activities.create(activity);
			const attendee = createAttendee(this.rootStore.userStore.user!);
			attendee.isHost = true;
			let attendees = [];
			attendees.push(attendee);
			activity.attendees = attendees;
			activity.comments = [];
			activity.isHost = true;
			runInAction(() => {
				this.activityRegistry.set(activity.id, activity);
				this.submitting = false;
			});
			history.push(`/activities/${activity.id}`);
		} catch (error) {
			runInAction(() => {
				this.submitting = false;
			});
			toast.error('Problem submitting data');
			console.log(error);
		}
	};

	@action editActivity = async (activity: IActivity) => {
		this.submitting = true;
		try {
			await agents.Activities.update(activity);
			runInAction(() => {
				this.activityRegistry.set(activity.id, activity);
				this.activity = activity;
				this.submitting = false;
			});
			history.push(`/activities/${activity.id}`);
		} catch (error) {
			runInAction(() => {
				this.submitting = false;
			});
			toast.error('Problem submitting data');
			console.log(error);
		}
	};

	@action deleteActivity = async (
		event: SyntheticEvent<HTMLButtonElement>,
		id: string,
	) => {
		this.submitting = true;
		this.target = event.currentTarget.name;
		try {
			await agents.Activities.delete(id);
			runInAction(() => {
				this.activityRegistry.delete(id);
				this.submitting = false;
				this.target = '';
			});
		} catch (error) {
			runInAction(() => {
				this.submitting = false;
				this.target = '';
			});
			console.log(error);
		}
	};

	@action attendActivity = async () => {
		const attendee = createAttendee(this.rootStore.userStore.user!);
		this.loading = true;
		await agents.Activities.attend(this.activity!.id);
		try {
			runInAction(() => {
				if (this.activity) {
					this.activity.attendees.push(attendee);
					this.activity.isGoing = true;
					this.activityRegistry.set(this.activity.id, this.activity);
				}
			});
		} catch (error) {
			toast.error('Problem signing up for activity');
		} finally {
			runInAction(() => {
				this.loading = false;
			});
		}
	};

	@action cancelAttendance = async () => {
		this.loading = true;
		try {
			await agents.Activities.unattend(this.activity!.id);
			runInAction(() => {
				if (this.activity) {
					this.activity.attendees = this.activity.attendees.filter(
						(a) => a.username !== this.rootStore.userStore.user!.username,
					);
					this.activity.isGoing = false;
					this.activityRegistry.set(this.activity.id, this.activity);
				}
			});
		} catch (error) {
			toast.error('Problem cancelling attendance');
		} finally {
			runInAction(() => {
				this.loading = false;
			});
		}
	};
}
