import React, { useContext } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import activityStore from "../../../app/stores/activityStore";
import { Link } from "react-router-dom";

const ActivityList: React.FC = () => {
  const ActivityStore = useContext(activityStore);
  const {
    submitting,
    target,
    deleteActivity,
    activitiesByDate,
  } = ActivityStore;
  return (
    <Segment clearing>
      <Item.Group divided>
        {activitiesByDate.map((activity) => (
          <Item key={activity.id}>
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>
                  {activity.city}, {activity.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                  name={activity.id}
                  onClick={(e) => deleteActivity(e, activity.id)}
                  floated="right"
                  content="Delete"
                  color="red"
                  loading={target === activity.id && submitting}
                />
                <Button
                  floated="right"
                  content="View"
                  color="blue"
                  as={Link} to={`/activities/${activity.id}`}
                />
                <Label basic content={activity.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};

export default observer(ActivityList);
