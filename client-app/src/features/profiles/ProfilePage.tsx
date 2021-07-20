import React, { useContext, useEffect } from 'react';

import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../app/layout/LoadingComponent';
import ProfileContent from './ProfileContent';
import ProfileHeader from './ProfileHeader';
import { RootStoreContext } from '../../app/stores/rootStore';
import { RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react-lite';

interface RouteParams {
	username: string;
}

interface IProps extends RouteComponentProps<RouteParams> {}

const ProfilePage: React.FC<IProps> = ({ match }) => {
	const rootStore = useContext(RootStoreContext);
	const {
		loadingProfile,
		profile,
		loadProfile,
		isCurrentUser,
		loading,
		follow,
		unfollow,
		setActiveTab,
	} = rootStore.profileStore;

	useEffect(() => {
		loadProfile(match.params.username);
	}, [loadProfile, match]);

	if (loadingProfile) return <LoadingComponent content="Loading profile..." />;

	return (
		<Grid>
			<Grid.Column>
				<ProfileHeader
					profile={profile!}
					isCurrentUser={isCurrentUser}
					loading={loading}
					follow={follow}
					unfollow={unfollow}
				/>
				<ProfileContent setActiveTab={setActiveTab} />
			</Grid.Column>
		</Grid>
	);
};

export default observer(ProfilePage);
