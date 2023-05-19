import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1684471228767 implements MigrationInterface {
    name = 'NewMigration1684471228767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_539ede39e518562dfdadfddb492\``);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`product_id\` \`product_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_539ede39e518562dfdadfddb492\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_539ede39e518562dfdadfddb492\``);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`product_id\` \`product_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_539ede39e518562dfdadfddb492\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
