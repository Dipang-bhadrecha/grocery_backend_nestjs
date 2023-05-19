import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1684414901815 implements MigrationInterface {
    name = 'NewMigration1684414901815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`first_name\` varchar(30) NOT NULL, \`last_name\` varchar(30) NOT NULL, \`phone\` bigint NOT NULL, \`email\` varchar(50) NOT NULL, \`password\` varchar(200) NOT NULL, \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user', \`reset_password_token\` varchar(100) NULL, \`reset_password_token_expire_time\` timestamp NULL, \`is_active\` tinyint NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_8e1f623798118e629b46a9e629\` (\`phone\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_8e1f623798118e629b46a9e629\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
