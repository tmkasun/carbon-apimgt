/*
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import Api from 'AppData/api';
import ConfigManager from 'AppData/ConfigManager';
import { Progress } from 'AppComponents/Shared';
import { withStyles } from '@material-ui/core/styles';

import LifeCycleUpdate from './LifeCycleUpdate';
import LifeCycleHistory from './LifeCycleHistory';

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: 10,
        width: theme.custom.contentAreaWidth,
    },
    titleWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    historyHead: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
    },
});
/**
 *
 *
 * @class LifeCycle
 * @extends {Component}
 */
class LifeCycle extends Component {
    /**
     * Creates an instance of LifeCycle.
     * @param {Object} props
     * @memberof LifeCycle
     */
    constructor(props) {
        super(props);
        this.api = new Api();
        this.state = {
            lcHistory: null,
            checkList: [],
        };
        this.updateData = this.updateData.bind(this);
        this.handleChangeCheckList = this.handleChangeCheckList.bind(this);
    }


    /**
     *
     * @inheritdoc
     * @memberof LifeCycle
     */
    componentDidMount() {
        this.updateData();
    }

    handleChangeCheckList = index => (event, checked) => {
        const checkList = this.state.checkList;
        checkList[index].checked = checked;
        this.setState({ checkList });
    };

    /**
     *
     *
     * @memberof LifeCycle
     */
    updateData() {
        const { id } = this.props;
        const promised_api = Api.get(id);
        // const promised_tiers = Api.policies('api');
        const promised_lcState = this.api.getLcState(id);
        let privateJetModeEnabled = false;

        ConfigManager.getConfigs().features.then((response) => {
            privateJetModeEnabled = response.data.privateJetMode.isEnabled;
        });

        // const promised_lcHistory = this.api.getLcHistory(id);
        // const promised_labels = this.api.labels();
        Promise.all([promised_api, promised_tiers, promised_lcState, promised_lcHistory, promised_labels])
            .then((response) => {
                const [api, tiers, lcState, lcHistory, labels] = response.map(data => data.obj);

                if (privateJetModeEnabled) {
                    if (!api.hasOwnGateway) {
                        const transitions = lcState.availableTransitionBeanList;
                        const PUBLISHED = 'Published';

                        for (const transition of transitions) {
                            if (transition.targetState === PUBLISHED && lcState.state !== PUBLISHED) {
                                const publish_in_private_jet_mode = {
                                    event: 'Publish In Private Jet Mode',
                                    targetState: 'Published In Private Jet Mode',
                                };
                                lcState.availableTransitionBeanList.push(publish_in_private_jet_mode);
                            }
                        }
                    }
                }
                // Creating checklist
                const checkList = [];
                let index = 0;
                for (const item of lcState.checkItemBeanList) {
                    checkList.push({
                        index,
                        label: item.name,
                        value: item.name,
                        checked: false,
                    });
                    index++;
                }
                this.setState({
                    api,
                    policies: tiers,
                    lcState,
                    lcHistory,
                    labels,
                    privateJetModeEnabled,
                    checkList,
                });
            })
            .catch((error) => {
                if (process.env.NODE_ENV !== 'production') {
                    console.log(error);
                }
                const status = error.status;
                if (status === 404) {
                    this.setState({ notFound: true });
                }
            });
    }
    /**
     *
     *
     * @returns
     * @memberof LifeCycle
     */
    render() {
        const {
            classes, api, lcState, checkList, privateJetModeEnabled,
        } = this.props;
        const { lcHistory } = this.state;

        if (!lcHistory) {
            return <Progress />;
        }
        return (
            <div className={classes.root}>
                <div className={classes.titleWrapper}>
                    <Typography variant='h4' align='left' className={classes.mainTitle}>
                        Lifecycle
                    </Typography>
                </div>
                <div className={classes.contentWrapper}>
                    <Grid container>
                        <Grid item xs={12}>
                            <LifeCycleUpdate
                                handleUpdate={this.updateData}
                                lcState={lcState}
                                checkList={checkList}
                                handleChangeCheckList={this.handleChangeCheckList}
                                api={api}
                                privateJetModeEnabled={privateJetModeEnabled}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {lcHistory.length > 1 && (
                                <div>
                                    <Typography variant='h6' gutterBottom className={classes.historyHead}>
                                        History
                                    </Typography>
                                    <LifeCycleHistory lcHistory={lcHistory} />
                                </div>
                            )}
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

LifeCycle.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LifeCycle);
