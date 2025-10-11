import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1759839917954 implements MigrationInterface {
  name = 'CreateUserTable1759839917954';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE user (
                id varchar(36) NOT NULL, 
                name varchar(255) NOT NULL, 
                email varchar(255) NOT NULL, 
                password varchar(255) NOT NULL, 
                phone_number varchar(255) NULL, 
                profile varchar(255) NULL DEFAULT 'default_user.png', 
                role varchar(255) NOT NULL DEFAULT 'user', 
                created_at timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), 
                updated_at timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
                deleted_at timestamp(6) NULL, 
                UNIQUE INDEX IDX_e12875dfb3b1d92d7d7c5377e2 (email), 
                PRIMARY KEY (id)) 
                ENGINE=InnoDB
    `);

    await queryRunner.query(`
            CREATE TABLE oauth_access_tokens (
                id varchar(36) NOT NULL, 
                userId varchar(255) NOT NULL, 
                tokenId varchar(255) NOT NULL, 
                expiresAt datetime NOT NULL, 
                revoked tinyint NOT NULL DEFAULT 0, 
                created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, 
                updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, 
                deleted_at datetime NULL, 
                PRIMARY KEY (id)) 
                ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE oauth_access_tokens
    `);

    await queryRunner.query(`
        DROP INDEX IDX_e12875dfb3b1d92d7d7c5377e2 ON user
    `);

    await queryRunner.query(`
        DROP TABLE user
    `);
  }
}
