import { action, observable, computed, configure, runInAction } from "mobx";
import { createContext,
    SyntheticEvent } from "react";
import agents from "../api/agents";
import { IActivity } from "../models/activity";
import { makeObservable } from "mobx";

configure({enforceActions:"always"})

class ActivityStore {
  constructor() {
    makeObservable(this);
  }

  @observable activityRegistry = new Map();
  @observable loadingInitial = false;
  @observable activity: IActivity | null = null;
  @observable submitting = false;
  @observable target = "";

  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agents.Activities.list();
      runInAction(() => {
        activities.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      })

    } catch (error) {
      runInAction( () => {
        this.loadingInitial = false;
      })
    }
  };

  @action loadActivity = async (id: string) =>{ 
    let activity = this.activityRegistry.get(id);
    if(activity){
      this.activity = activity;
    }
    else{
      this.loadingInitial = true;
      try {
        activity = await agents.Activities.details(id);
        runInAction( () => {
          this.activity = activity
          this.loadingInitial = false;
        })
      } catch (error) {
        runInAction( () => {
          this.loadingInitial = false;
        })
        console.log(error)
      }
    }
  }

  @action clearActivity = () =>{
    this.activity = null;
  }

  getActivity = async (id: string) =>{ 
    return this.activityRegistry.get(id);
  }

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agents.Activities.create(activity);
      runInAction( () => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      })
    } catch (error) {
      runInAction( () => {
        this.submitting = false;
      })
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
      })

    } catch (error) {
      runInAction(() => {
        this.submitting = false;
      })
      console.log(error);
    }
  };

  @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agents.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = '';
      })
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
        this.target = '';
      })
      console.log(error);
    }
  }
}

export default createContext(new ActivityStore());
