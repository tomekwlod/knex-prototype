import {MigrationInterface, QueryRunner} from 'typeorm';

require('@babel/polyfill');

require('dotenv-up')(5, true, 'migration-users');

import debug from '../../CI/debug';

const delay = require('nlab/delay');

const log = require('inspc');

const knex = require('knex-prototype');

const config = require('../../../models/config');

knex.init(config);

const users = [
  {
    firstName: 'admin',
    lastName: 'admin',
    email: 'admin@gmail.com',
    password: process.env.PROTECTED_ADMIN_PASS,
    enabled: 1,
    roles: ['admin', 'user'],
  },
  {
    firstName: 'user',
    lastName: 'user',
    email: 'user@gmail.com',
    password: 'password1234',
    enabled: 1,
    roles: ['user'],
  },
];

export class auto1624999697548 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // process.exit(0);

    const connection = knex('pg');

    const model = connection.model;

    return await connection
      .transaction(async (trx) => {
        let tmp;

        while ((tmp = users.shift())) {
          const {roles, ...user} = tmp;

          let count = await model.common.queryColumn(
            {
              trx,
            },
            `SELECT count(*) c from users where email = ?`,
            [user.email]
          );

          count = parseInt(count, 10);

          let id;

          if (count) {
            await model.users.update(
              {
                trx,
              },
              user,
              {
                email: user.email,
              }
            );

            id = await model.users.queryColumn(
              {
                trx,
              },
              `SELECT id from users where email = :email`,
              {
                email: user.email,
              }
            );
          } else {
            id = await model.users.insert(
              {
                trx,
              },
              user
            );
          }

          //                 for (var i = 0, l = roles.length ; i < l ; i += 1 ) {
          //
          //                     const role = roles[i];
          //
          //                     const count = await model.user_role.queryColumn(trx, `
          // select            count(*) c
          // from              users u
          //        inner join user_role ur
          //                on ur.user_id = u.id
          //        inner join roles r
          //                on r.id = ur.role_id
          // where             u.email = :email
          //               and r.name = :role
          // `, {
          //                         email   : user.email,
          //                         role,
          //                     });
          //
          //                     if ( count ) {
          //
          //                         log(`\n\nuser '${user.email}' has role '${role}'\n`)
          //                     }
          //                     else {
          //
          //                         log(`\n\nadding role '${role}' to user '${user.email}'\n`);
          //
          //                         const roleId = await model.user_role.queryColumn(trx, `SELECT id from roles where name = ?`, [role]);
          //
          //                         await model.user_role.query(trx, `insert into user_role (user_id, role_id) values (?, ?)`, [id, roleId]);
          //                     }
          //                 }
        }
      })
      .then(
        () => {
          // setTimeout(() => process.exit(0), 1000);
        },
        (e) => {
          log.dump(e, 2);

          process.exit(1);
        }
      );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const connection = knex();

    const model = connection.model;

    return await connection
      .transaction(async (trx) => {
        const u = users.map((u) => u.email);

        // const r = users.reduce((acc, user) => {
        //
        //     if (Array.isArray(user.roles)) {
        //
        //         user.roles.forEach(role => {
        //             if (acc.indexOf(role) === -1) {
        //
        //                 acc.push(role);
        //             }
        //         })
        //     }
        //
        //     return acc;
        // }, []);

        //             const list = await model.common.query(trx, `
        // select          ur.*
        // from            users u
        //      inner join user_role ur
        //              on u.id = ur.user_id
        //      inner join roles r
        //              on r.id = ur.role_id
        // where           u.email in (:u) and r.name in (:r)
        // `, {
        //                 u,
        //                 r,
        //             });
        //
        //             for (let i = 0, l = list.length ; i < l ; i += 1 ) {
        //
        //                 const p = list[i];
        //
        //                 // log.dump(p);
        //
        //                 await model.user_role.query(`delete from user_role where user_id = :user_id and role_id = :role_id`, list[i]);
        //             }

        await model.common.query(
          {
            trx,
          },
          `delete from users where email in (:emails)`,
          {
            emails: u,
          }
        );
      })
      .then(
        () => {
          // setTimeout(() => process.exit(0), 1000);
        },
        (e) => {
          log.dump(e, 2);

          process.exit(1);
        }
      );
  }
}
