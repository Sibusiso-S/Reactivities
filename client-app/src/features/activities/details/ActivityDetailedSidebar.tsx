import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Segment, List, Item, Label, Image } from 'semantic-ui-react';
import { IAttendee } from '../../../app/models/activity';

interface IProp {
	attendees: IAttendee[];
}

const ActivityDetailedSidebar: React.FC<IProp> = ({ attendees }) => {
	return (
		<Fragment>
			<Segment
				textAlign="center"
				style={{ border: 'none' }}
				attached="top"
				secondary
				inverted
				color="teal"
			>
				{attendees.length} {attendees.length === 1 ? ' person' : ' people'}{' '}
				going
			</Segment>
			<Segment attached>
				<List relaxed divided>
					{attendees.map((attendee) => (
						<Item key={attendee.username} style={{ position: 'relative' }}>
							{attendee.isHost && (
								<Label
									style={{ position: 'absolute' }}
									color="orange"
									ribbon="right"
								>
									Host
								</Label>
							)}
							<Image size="tiny" src={attendee.image || '/assets/user.png'} />
							<Item.Content verticalAlign="middle">
								<Item.Header as="h3">
									<Link to={`/profile/${attendee.username}`}>
										{attendee.displayName}
									</Link>
								</Item.Header>
								{attendee.following && (
									<Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>
								)}
							</Item.Content>
						</Item>
					))}
				</List>
			</Segment>
		</Fragment>
	);
};

export default observer(ActivityDetailedSidebar);
