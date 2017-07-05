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

import React, {Component} from 'react'
import TransitionStateButton from "./TransitionStateButton";
import {Radio, Checkbox, message, Alert} from 'antd'
const ButtonGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

import API from '../../../../data/api'

export default class LifeCycleUpdate extends Component {
    constructor() {
        super();
        this.updateLifeCycleState = this.updateLifeCycleState.bind(this);
        this.handleCheckItem = this.handleCheckItem.bind(this);
        this.api = new API();
        this.state = {
            checkedItems: ''
        }
    }

    updateLifeCycleState(event) {
        event.preventDefault();
        let promisedUpdate;
        const newState = event.target.value;
        const apiUUID = this.props.api.id;
        if (this.state.checkedItems !== '') {
            promisedUpdate = this.api.updateLcState(apiUUID, newState, this.state.checkedItems);
        } else {
            promisedUpdate = this.api.updateLcState(apiUUID, newState);
        }
        promisedUpdate.then(response => { /*TODO: Handle IO erros ~tmkb*/
            this.props.handleUpdate(true);
            message.info("Lifecycle state updated successfully");
            /*TODO: add i18n ~tmkb*/
        })
    }

    handleCheckItem(event) {
        event.preventDefault();
    }

    render() {
        const {lcState, api} = this.props;
        const is_workflow_pending = api.workflowStatus.toLowerCase() === "pending";
        const checkList = lcState.checkItemBeanList.map(item => ({label: item.name, value: item.value}));
        return (
            <div>
                {
                    is_workflow_pending ?
                        (
                            <Alert
                                message="Warning"
                                description="Pending lifecycle state change."
                                type="warning"
                                showIcon
                            />
                        ) :
                        (
                            <Alert
                                message={api.lifeCycleStatus}
                                description="Current Life Cycle State"
                                type="info"
                                showIcon
                            />
                        )
                }
                {
                    !is_workflow_pending && <CheckboxGroup options={checkList} onChange={this.handleCheckItem}/>
                }
                <ButtonGroup onChange={this.updateLifeCycleState}>
                    {
                        is_workflow_pending ?
                            (
                                <div className="btn-group" role="group">
                                    <input type="button" className="btn btn-primary wf-cleanup-btn"
                                           defaultValue="Delete pending lifecycle state change request"/>
                                </div>
                            ) :
                            (
                                lcState.availableTransitionBeanList.map(
                                    transition_state => lcState.state !== transition_state.targetState &&
                                    <TransitionStateButton key={transition_state.event} state={transition_state}/>
                                ) /* Skip when transitions available for current state , this occurs in states where have allowed re-publishing in prototype and published sates*/
                            )
                    }
                </ButtonGroup>
            </div>
        );
    }
}