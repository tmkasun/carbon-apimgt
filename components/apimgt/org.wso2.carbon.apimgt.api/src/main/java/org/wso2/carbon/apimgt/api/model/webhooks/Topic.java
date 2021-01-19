/*
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

package org.wso2.carbon.apimgt.api.model.webhooks;

import java.io.Serializable;

public class Topic implements Serializable {
    private String name;
    private String apiId;
    private String subscribeURL;

    public String getName() {

        return name;
    }

    public void setName(String name) {

        this.name = name;
    }

    public String getApiId() {

        return apiId;
    }

    public void setApiId(String apiId) {

        this.apiId = apiId;
    }

    public String getSubscribeURL() {

        return subscribeURL;
    }

    public void setSubscribeURL(String subscribeURL) {

        this.subscribeURL = subscribeURL;
    }
}
