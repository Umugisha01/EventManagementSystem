using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RwandaEventHub.Migrations
{
    /// <inheritdoc />
    public partial class AllowZeroCapacityVenues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Venue_Capacity",
                table: "Venues");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Venue_Capacity",
                table: "Venues",
                sql: "Capacity >= 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Venue_Capacity",
                table: "Venues");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Venue_Capacity",
                table: "Venues",
                sql: "Capacity > 0");
        }
    }
}
