using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class ActivityEntityAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Activities",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    Category = table.Column<string>(nullable: true),
                    Date = table.Column<DateTime>(nullable: false),
                    City = table.Column<string>(nullable: true),
                    Venue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Activities", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Values",
                keyColumn: "ID",
                keyValue: 1,
                column: "Name",
                value: "Values 101");

            migrationBuilder.UpdateData(
                table: "Values",
                keyColumn: "ID",
                keyValue: 2,
                column: "Name",
                value: "Values 102");

            migrationBuilder.UpdateData(
                table: "Values",
                keyColumn: "ID",
                keyValue: 3,
                column: "Name",
                value: "Values 103");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Activities");

            migrationBuilder.UpdateData(
                table: "Values",
                keyColumn: "ID",
                keyValue: 1,
                column: "Name",
                value: "101");

            migrationBuilder.UpdateData(
                table: "Values",
                keyColumn: "ID",
                keyValue: 2,
                column: "Name",
                value: "102");

            migrationBuilder.UpdateData(
                table: "Values",
                keyColumn: "ID",
                keyValue: 3,
                column: "Name",
                value: "103");
        }
    }
}
