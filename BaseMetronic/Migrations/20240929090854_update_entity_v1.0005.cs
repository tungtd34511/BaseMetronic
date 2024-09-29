using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BaseMetronic.Migrations
{
    public partial class update_entity_v10005 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AuthorId",
                table: "DirectoryItem",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ParentId",
                table: "DirectoryItem",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TreeIds",
                table: "DirectoryItem",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_DirectoryItem_AuthorId",
                table: "DirectoryItem",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_DirectoryItem_ParentId",
                table: "DirectoryItem",
                column: "ParentId");

            migrationBuilder.AddForeignKey(
                name: "FK_DirectoryItem_Account_AuthorId",
                table: "DirectoryItem",
                column: "AuthorId",
                principalTable: "Account",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DirectoryItem_DirectoryItem_ParentId",
                table: "DirectoryItem",
                column: "ParentId",
                principalTable: "DirectoryItem",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DirectoryItem_Account_AuthorId",
                table: "DirectoryItem");

            migrationBuilder.DropForeignKey(
                name: "FK_DirectoryItem_DirectoryItem_ParentId",
                table: "DirectoryItem");

            migrationBuilder.DropIndex(
                name: "IX_DirectoryItem_AuthorId",
                table: "DirectoryItem");

            migrationBuilder.DropIndex(
                name: "IX_DirectoryItem_ParentId",
                table: "DirectoryItem");

            migrationBuilder.DropColumn(
                name: "AuthorId",
                table: "DirectoryItem");

            migrationBuilder.DropColumn(
                name: "ParentId",
                table: "DirectoryItem");

            migrationBuilder.DropColumn(
                name: "TreeIds",
                table: "DirectoryItem");
        }
    }
}
