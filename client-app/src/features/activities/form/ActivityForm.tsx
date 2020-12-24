import React, { useState, FormEvent } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import {v4 as uuid} from "uuid";

interface IProps {
  setEditMode: (editMode: boolean) => void;
  activity: IActivity;
  createActivity: (activity: IActivity) => void;
  editActivity: (activity: IActivity) => void;
}

const ActivityForm: React.FC<IProps> = ({
  setEditMode,
  activity: intialFormState,
  createActivity,
  editActivity,
}) => {
  const initializeForm = () => {
    if (intialFormState) return intialFormState;
    else
      return {
        id: "",
        title: "",
        description: "",
        category: "",
        date: "",
        city: "",
        venue: "",
      };
  };

  const [activity, setActivity] = useState<IActivity>(initializeForm);

  const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = () =>{
      if(activity.id.length ===0){
        let newActivity ={
          ...activity,
          id:uuid()
        }
        createActivity(newActivity);
      }
      else
        editActivity(activity);
  }
  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          name="title"
          onChange={handleInputChange}
          placeholder="Title"
          value={activity.title}
        />
        <Form.TextArea
          name="description"
          onChange={handleInputChange}
          rows={2}
          placeholder="Description"
          value={activity.description}
        />
        <Form.Input
          name="category"
          onChange={handleInputChange}
          placeholder="Category"
          value={activity.category}
        />
        <Form.Input
          name="date"
          onChange={handleInputChange}
          type="datetime-local"
          placeholder="Date"
          value={activity.date}
        />
        <Form.Input
          name="city"
          onChange={handleInputChange}
          placeholder="City"
          value={activity.city}
        />
        <Form.Input
          name="venue"
          onChange={handleInputChange}
          placeholder="Venue"
          value={activity.venue}
        />
        <Button
          floated="right"
          type="button"
          onClick={() => setEditMode(false)}
          content="Cancel"
        />
        <Button floated="right" positive type="submit" content="Submit" />
      </Form>
    </Segment>
  );
};

export default ActivityForm;
