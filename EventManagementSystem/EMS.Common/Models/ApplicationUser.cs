using System;

namespace EventManagementSystem.Common.Models
{
    public class ApplicationUser : BaseEntity
    {
        public string UserName { get; set; }
        public string Email { get; set; }
    }
}
