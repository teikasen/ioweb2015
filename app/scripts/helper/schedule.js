/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

window.IOWA = window.IOWA || {};

IOWA.Schedule = (function() {

  "use strict";

  var SCHEDULE_ENDPOINT = 'api/v1/schedule';
  var SCHEDULE_ENDPOINT_USERS = 'api/v1/user/schedule';

  var scheduleData_ = null;
  var userScheduleData_ = null;

  function onError(e) {
    IOWA.Elements.Toast.showMessage('Sign-in to add events to My Schedule', null, 'Sign-in', function() {
      IOWA.Elements.GoogleSignIn.signIn();
      // TODO(jeffy): setup push notification, and retry their save.
    });
  }

  /**
   * Fetches the I/O schedule data.
   * @return {Promise} Resolves with response schedule data.
   */
  function fetchSchedule() {
    if (scheduleData_) {
      return Promise.resolve(scheduleData_);
    }

    return IOWA.Request.xhrPromise('GET', SCHEDULE_ENDPOINT, false).then(function(resp) {
      scheduleData_ = resp;
      return scheduleData_;
    });
  }

  /**
   * Fetches the user's saved sessions.
   * @return {Promise} Resolves with response schedule data.
   */
  function fetchUserSchedule() {
    if (userScheduleData_) {
      return Promise.resolve(userScheduleData_);
    }

    return IOWA.Request.xhrPromise('GET', SCHEDULE_ENDPOINT_USERS, true).then(function(resp) {
      userScheduleData_ = resp;
      return userScheduleData_;
    });
  }

  /**
   * Adds/removes a session from the user's bookmarked sessions.
   * @param {string} sessionId The session to add/remove.
   * @param {Boolean} save True if the session should be added, false if it
   *     should be removed.
   * @return {Promise} Resolves with the server's response.
   */
  function saveSession(sessionId, save) {
    IOWA.Analytics.trackEvent('session', 'bookmark', save);

    var url = SCHEDULE_ENDPOINT_USERS + '/' + sessionId;
    return IOWA.Request.xhrPromise(save ? 'PUT' : 'DELETE', url, true).then(function(resp) {

      if (save) {
        IOWA.Elements.Toast.showMessage("Added to My Schedule. You'll get a notification before it starts.");
      } else {
        IOWA.Elements.Toast.showMessage('Removed from My Schedule');
      }

      // TODO(jeffy): remove notification for session.

      return resp;
    }).catch(onError);
  }

  return {
    fetchSchedule: fetchSchedule,
    fetchUserSchedule: fetchUserSchedule,
    saveSession: saveSession
  };

})();