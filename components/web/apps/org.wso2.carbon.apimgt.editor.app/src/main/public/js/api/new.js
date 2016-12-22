/**
 * Copyright (c) 2016, WSO2 Inc. (http://wso2.com) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
$(
    function () {
        $('#api-create-submit').on('click',
            function (event) {
                event.preventDefault();
                var api_data = {
                    namea: $("#new-api-name").val(),
                    context: $('#new-api-context').val(),
                    version: $('#new-api-version').val()
                };
                var new_api = new API('a58ec0d7-7075-3970-95e7-0532f8763d5a');
                new_api.create(api_data);
            }
        );
    }
);