import { Card, Icon, Image } from 'semantic-ui-react';

import { IProfile } from '../../app/models/profile';
import { Link } from 'react-router-dom';
import React from 'react';

interface IProp {
	profile: IProfile;
}

const ProfileCard: React.FC<IProp> = ({ profile }) => {
	return (
		<Card as={Link} to={`/profile/${profile.username}`}>
			<Image src={profile.image || '/assets/user.png'} />
			<Card.Content>
				<Card.Header>{profile.displayName}</Card.Header>
			</Card.Content>
			<Card.Content extra>
				<div>
					<Icon name="user" />
					{profile.followersCount} Followers
				</div>
			</Card.Content>
		</Card>
	);
};

export default ProfileCard;
