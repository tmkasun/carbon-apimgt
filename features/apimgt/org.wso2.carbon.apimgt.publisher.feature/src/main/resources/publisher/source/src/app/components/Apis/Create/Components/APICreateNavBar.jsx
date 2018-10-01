import React from 'react';
import APIsIcon from '@material-ui/icons/SettingsInputHdmi';
import { withRouter } from 'react-router-dom';

import PageNav from 'AppComponents/Base/container/navigation/PageNav';
import NavItem from 'AppComponents/Base/container/navigation/NavItem';

const APICreateNavBar = () => {
    const section = <NavItem name='APIs' NavIcon={<APIsIcon />} />;
    return <PageNav section={section} />;
};

export default withRouter(APICreateNavBar);
