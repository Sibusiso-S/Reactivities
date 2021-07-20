import ProfileFollowings from './ProfileFollowings';
import ProfilePhotos from './ProfilePhotos';
import React from 'react';
import { Tab } from 'semantic-ui-react';

const panes = [
	{ menuItem: 'About', render: () => <Tab.Pane>About content</Tab.Pane> },
	{ menuItem: 'Photos', render: () => <ProfilePhotos /> }, //This causes an error
	{
		menuItem: 'Activities',
		render: () => <Tab.Pane>Activities content</Tab.Pane>,
	},
	{
		menuItem: 'Followers',
		render: () => <ProfileFollowings />,
	},
	{
		menuItem: 'Following',
		render: () => <ProfileFollowings />,
	},
];

interface IProps {
	setActiveTab: (activeIndex: any) => void;
}

const ProfileContent: React.FC<IProps> = ({ setActiveTab }) => {
	return (
		<Tab
			menu={{ fluid: true, vertical: true }}
			menuPosition="right"
			panes={panes}
			onTabChange={(e, data) => setActiveTab(data.activeIndex)}
		/>
	);
};

export default ProfileContent;
