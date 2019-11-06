const request = require('supertest');
const app = require('../app');
describe('Post /pipeline-event', () => {
  let data = {
    "object_kind": "pipeline",
    "object_attributes":{
       "id": 31,
       "ref": "master",
       "tag": false,
       "sha": "bcbb5ec396a2c0f828686f14fac9b80b780504f2",
       "before_sha": "bcbb5ec396a2c0f828686f14fac9b80b780504f2",
       "source": "merge_request_event",
       "status": "success",
       "stages":[
          "build",
          "test",
          "deploy"
       ],
       "created_at": "2016-08-12 15:23:28 UTC",
       "finished_at": "2016-08-12 15:26:29 UTC",
       "duration": 63,
       "variables": [
         {
           "key": "NESTOR_PROD_ENVIRONMENT",
           "value": "us-west-1"
         }
       ]
    },
     "merge_request": {
       "id": 1,
       "iid": 1,
       "title": "Test",
       "source_branch": "test",
       "source_project_id": 1,
       "target_branch": "master",
       "target_project_id": 1,
       "state": "opened",
       "merge_status": "can_be_merged",
       "url": "http://192.168.64.1:3005/gitlab-org/gitlab-test/merge_requests/1"
    },
    "user":{
       "name": "Administrator",
       "username": "root",
       "avatar_url": "http://www.gravatar.com/avatar/e32bd13e2add097461cb96824b7a829c?s=80\u0026d=identicon"
    },
    "project":{
       "id": 1,
       "name": "Gitlab Test",
       "description": "Atque in sunt eos similique dolores voluptatem.",
       "web_url": "http://192.168.64.1:3005/gitlab-org/gitlab-test",
       "avatar_url": null,
       "git_ssh_url": "git@192.168.64.1:gitlab-org/gitlab-test.git",
       "git_http_url": "http://192.168.64.1:3005/gitlab-org/gitlab-test.git",
       "namespace": "Gitlab Org",
       "visibility_level": 20,
       "path_with_namespace": "gitlab-org/gitlab-test",
       "default_branch": "master"
    }
 };

  it('respond with 201 created', (done) => {
    request(app)
      .post('/api/pipeline-event')
      .send(data)
      .then( (response) => {
        expect(response.statusCode).toBe(201);
        done();
      });
  });

  it('respond with 422 on missing pipeline status', (done) => {

    let invalidData = Object.assign({}, data);
    delete invalidData.object_attributes.status;
    request(app)
      .post('/api/pipeline-event')
      .send(data)
      .then( (response) => {
        expect(response.statusCode).toBe(422);
        done();
      });
  });
});