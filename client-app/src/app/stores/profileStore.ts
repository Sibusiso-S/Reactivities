import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';
import agents from '../api/agents';
import { IProfile } from '../models/profile';
import { RootStore } from './rootStore';

export default class ProfileStore {
	rootStore: RootStore;
	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeObservable(this);
	}

	@observable profile: IProfile | null = null;
	@observable loadingProfile = true;

	@computed get isCurrentUser() {
		if (this.rootStore.userStore.user && this.profile) {
			return this.rootStore.userStore.user.username === this.profile.username;
		} else {
			return false;
		}
	}

	@action loadProfile = async (username: string) => {
		this.loadingProfile = true;
		console.log('Profile log true');
		const profile = await agents.Profiles.get(username);
		try {
			runInAction(() => {
				console.log('Profile log false');
				this.loadingProfile = false;
				this.profile = profile;
			});
		} catch (error) {
			runInAction(() => {
				console.log('Profile log false');
				this.loadingProfile = false;
			});
			console.log(error);
		}
	};
}
