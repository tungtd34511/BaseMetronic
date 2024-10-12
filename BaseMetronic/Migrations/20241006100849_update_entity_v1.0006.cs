using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BaseMetronic.Migrations
{
    public partial class update_entity_v10006 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TreeIds",
                table: "DirectoryItem");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TreeIds",
                table: "DirectoryItem",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
