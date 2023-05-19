import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1684410648422 implements MigrationInterface {
    name = 'NewMigration1684410648422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_23c05c292c439d77b0de816b50\` ON \`category\``);
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`name\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`category\` ADD UNIQUE INDEX \`IDX_23c05c292c439d77b0de816b50\` (\`name\`)`);
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`image_url\``);
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`image_url\` varchar(200) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`name\` varchar(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`description\` varchar(200) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`description\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`image_url\``);
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`image_url\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`category\` DROP INDEX \`IDX_23c05c292c439d77b0de816b50\``);
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_23c05c292c439d77b0de816b50\` ON \`category\` (\`name\`)`);
    }

}
