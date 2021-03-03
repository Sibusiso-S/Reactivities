import React from "react";
import { List, Image, Popup } from "semantic-ui-react";
import { IAttendee } from "../../../app/models/activity";

interface IProp {
	attendees: IAttendee[];
}

const ActivityListItemAttendees: React.FC<IProp> = ({ attendees }) => {
	return (
		<List horizontal>
			{attendees.map((attendee) => (
				<List.Item>
					<Popup
						header={attendee.displayName}
						trigger={
							<Image
								size="mini"
								circular
								src={attendee.image || "/assets/user.png"}
							/>
						}
					/>
				</List.Item>
			))}
		</List>
	);
};

export default ActivityListItemAttendees;
