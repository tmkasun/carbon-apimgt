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
"use strict";

import Utils from './Utils'

/**
 * Represent an user logged in to the application, There will be allays one user per session and
 * this user details will be persist in browser localstorage.
 */
export default class User {
    /**
     * Create a user for the given environment
     * @param {string} environment
     * @param {string} name
     * @param {string} id_token
     * @param {boolean} remember
     * @returns {User|null} user object
     */
    constructor(environment, name, id_token, remember = false) {
        const user = User._userMap.get(environment);
        if (user) {
            return user;
        }
        this.name = name;
        this.environment = environment;
        this._scopes = [];
        this._idToken = id_token;
        this._remember = remember;
        User._userMap.set(environment, this);
    }

    /**
     * OAuth scopes which are available for use by this user
     * @returns {Array} : An array of scopes
     */
    get scopes() {
        return this._scopes;
    }

    /**
     * Set OAuth scopes available to be used by this user
     * @param {Array} newScopes :  An array of scopes
     */
    set scopes(newScopes) {
        Object.assign(this.scopes, newScopes);
    }

    /**
     * User utility method to create an user from JSON object.
     * @param {JSON} userJson : Need to provide user information in JSON structure to create an user object
     * @returns {User} : An instance of User(this) class.
     */
    static fromJson(userJson) {
        if (!userJson.name) {
            throw "Need to provide user `name` key in the JSON object, to create an user";
        }
        const _user = new User(Utils.getEnvironment().label, userJson.name);
        _user.scopes = userJson.scopes;
        _user.idToken = userJson.idToken;
        _user.rememberMe = userJson.remember;
        return _user;
    }

    /**
     * Get the JS accessible access token fragment from cookie storage.
     * @returns {String|null}
     */
    getPartialToken() {
        //Append environment name to cookie
        const environmentName = "_" + Utils.getEnvironment().label;
        return Utils.getCookie(User.CONST.WSO2_AM_TOKEN_1 + environmentName);
    }

    /**
     * Get the JS accessible refresh token fragment from cookie storage.
     * @returns {String|null}
     */
    getRefreshPartialToken() {
        //Append environment name to cookie
        const environmentName = "_" + Utils.getEnvironment().label;
        return Utils.getCookie(User.CONST.WSO2_AM_REFRESH_TOKEN_1 + environmentName);
    }

    /**
     * Store the JavaScript accessible access token segment in cookie storage
     * @param {String} newToken : Part of the access token which needs when accessing REST API
     * @param {Number} validityPeriod : Validity period of the cookie in seconds
     * @param path Path which need to be set to cookie
     */
    setPartialToken(newToken, validityPeriod, path) {
        Utils.delete_cookie(User.CONST.WSO2_AM_TOKEN_1, path);
        const cookieName = `${User.CONST.WSO2_AM_TOKEN_1}_${Utils.getEnvironment().label}`;
        Utils.setCookie(cookieName, newToken, validityPeriod, path);
    }

    /**
     * Get the expiry time of the user
     * @returns {Date} JS Date object of the expiring time of the user
     */
    getExpiryTime() {
        const expireTime = +localStorage.getItem(User.CONST.USER_EXPIRY_TIME);
        return new Date(expireTime);
    }

    /**
     * Set user expiry time, User validity expires with the expiry of user's access token
     * @param expireTime {Integer} Number of seconds till the expire time from the current time
     */
    setExpiryTime(expireTime) {
        const currentTime = Date.now();
        const timeDiff = (1000 * expireTime);
        localStorage.setItem(User.CONST.USER_EXPIRY_TIME, currentTime + timeDiff);
        this.expiryTime = new Date(currentTime + timeDiff);
        return this.expiryTime;
    }

    /**
     *
     * @param type
     */
    checkPermission(type) {
        throw ("Not implemented!");
    }

    /**
     * Provide user data in JSON structure.
     * @returns {JSON} : JSON representation of the user object
     */
    toJson() {
        return {
            name: this.name,
            scopes: this._scopes,
            idToken: this._idToken,
            remember: this._remember,
            expiryTime: this.getExpiryTime(),
            environment: this.environment
        };
    }
}

User.CONST = {
    WSO2_AM_TOKEN_MSF4J: "WSO2_AM_TOKEN_MSF4J",
    WSO2_AM_TOKEN_1: "WSO2_AM_TOKEN_1",
    WSO2_AM_REFRESH_TOKEN_1: "WSO2_AM_REFRESH_TOKEN_1",
    LOCALSTORAGE_USER: "wso2_user_publisher",
    USER_EXPIRY_TIME: "user_expiry_time"
};
/**
 * Map of users (key = environmentLabel, value = User instance)
 * @type {Map}
 * @private
 */
User._userMap = new Map();
