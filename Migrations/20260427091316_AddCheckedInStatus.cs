using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RwandaEventHub.Migrations
{
    /// <inheritdoc />
    public partial class AddCheckedInStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Seats_VenueId_SeatNumber",
                table: "Seats");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Booking_Status",
                table: "Bookings");

            migrationBuilder.AlterColumn<string>(
                name: "Row",
                table: "Seats",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(5)",
                oldMaxLength: 5,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Seats_VenueId_Row_SeatNumber",
                table: "Seats",
                columns: new[] { "VenueId", "Row", "SeatNumber" },
                unique: true,
                filter: "[Row] IS NOT NULL");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Booking_Status",
                table: "Bookings",
                sql: "BookingStatus IN ('Reserved', 'Confirmed', 'CheckedIn', 'Expired', 'Cancelled')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Seats_VenueId_Row_SeatNumber",
                table: "Seats");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Booking_Status",
                table: "Bookings");

            migrationBuilder.AlterColumn<string>(
                name: "Row",
                table: "Seats",
                type: "nvarchar(5)",
                maxLength: 5,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Seats_VenueId_SeatNumber",
                table: "Seats",
                columns: new[] { "VenueId", "SeatNumber" },
                unique: true);

            migrationBuilder.AddCheckConstraint(
                name: "CK_Booking_Status",
                table: "Bookings",
                sql: "BookingStatus IN ('Reserved', 'Confirmed', 'Expired', 'Cancelled')");
        }
    }
}
