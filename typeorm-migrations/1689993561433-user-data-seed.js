const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class UserDataSeed1689993561433 {
  async up(queryRunner) {
    await queryRunner.query(`
                            INSERT INTO auth.api_routes (uuid,status,created_at,updated_at,deleted_at,route) VALUES ('b0ccf47c-76ac-45c6-9a20-815c52fdc10d','1','2023-07-17 12:38:56.726','2023-07-17 12:38:56.726',NULL,'/test');
                            INSERT INTO auth.applications (uuid,status,created_at,updated_at,deleted_at,description,public_key,private_key,third_party_application) VALUES ('1120d390-28be-4d0e-a730-10f368cb209d','1','2023-07-17 12:42:33.689507','2023-07-17 12:42:33.689507',NULL,'app do medico','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTEyMGQzOTAtMjhiZS00ZDBlLWE3MzAtMTBmMzY4Y2IyMDlkIiwiaWF0IjoxNTE2MjM5MDIyfQ.XFoLT30XxKy6cRNwZGFoaSxJIFlD02TDdS-1lqWk78Q','','0');
                            INSERT INTO auth.api_routes_applications (uuid,status,created_at,updated_at,deleted_at,application_id,api_route_id) VALUES ('13378247-332e-4411-a214-9eadda2f8c2a','1','2023-07-17 12:43:10.599892','2023-07-17 12:43:10.599892',NULL,1,1);
                            INSERT INTO auth.person (status, created_at, updated_at, deleted_at, uuid) VALUES ('1', '2023-07-06 16:49:21.154', '2023-07-06 16:49:21.154', NULL, '220ab7d5-9045-40f5-9689-fb011d8e263a');
                            insert into auth.users_groups (name,status) values ('group_app',1);
                            INSERT INTO auth.users (status, created_at, updated_at, deleted_at, username, "password", verification_code, person_id, uuid) VALUES ('1', '2023-07-06 16:49:21.154', '2023-07-11 02:49:17.517', NULL, 'devuser', 'no_password', 'M426TA', 1, '90120c3d-4a8d-4421-a3ac-5d03a2fb53d8');
                            insert into auth.users_groups_user (user_id,user_group_id,main,status) values (1,1,1,1);
                            INSERT INTO auth.person_contacts_type (status, created_at, updated_at, deleted_at, description, uuid) VALUES('1', '2023-07-11 00:41:06.511', '2023-07-11 00:41:06.511', NULL, 'EMAIL', NULL);
                            INSERT INTO auth.person_contacts ( status, created_at, updated_at, deleted_at, description, main, person_id, person_contact_type_id, uuid) VALUES ('1', '2023-07-11 00:45:23.075', '2023-07-11 00:45:23.075', NULL, 'jefferson.wendhel@swalliance.com.br', '1', 1, 1, '5a271d23-375d-462c-8eb7-cbad6f97379b');
                            INSERT INTO auth.users_groups_permissions (uuid,status,created_at,updated_at,deleted_at,api_route_application_id,"action",user_group_id) VALUES ('b129ac48-97a2-4792-ac1a-2e369d54d6b4','1','2023-07-18 00:37:23.687555','2023-07-18 00:37:23.687555',NULL,1,'GET',1);
                            INSERT INTO auth.person_contacts_type (uuid,status,created_at,updated_at,deleted_at,description) VALUES  ('c5429511-f0be-4b06-a764-5f2588acaadb','1','2023-07-21 22:27:02.125698','2023-07-21 22:27:02.125698',NULL,'PHONE');
                            `);
  }
  async down(queryRunner) {}
};
