using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.Util;
using System.Security.Cryptography;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            // Don't return password hash and salt
            user.PasswordHash = string.Empty;
            user.Salt = string.Empty;

            return user;
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            // Update timestamp
            user.UpdatedAt = DateTime.UtcNow;

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        [HttpPost("register")]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser != null)
            {
                return Conflict("A user with this email already exists.");
            }

            // Set creation timestamp
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            user.Salt = Convert.ToBase64String(RandomNumberGenerator.GetBytes(36));
            
            // Fix for CS1503: Convert user.Salt (string) to byte[] before passing to HashPassword
            user.PasswordHash = PasswordHasher.HashPassword(user.Password, Convert.FromBase64String(user.Salt));

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.UserId }, user);
        }

        [HttpPost("Login")]
        public async Task<ActionResult<User>> Login([FromBody] LoginRequest loginRequest)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginRequest.Email);
            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }
            // Replace the selected code in Login method with VerifyPassword

            //if (!PasswordHasher.VerifyPassword(loginRequest.Password, user.PasswordHash, Convert.FromBase64String(user.Salt)))
            //{
            //    return Unauthorized("Invalid email or password.");
            //}
            //var hashedPassword = PasswordHasher.HashPassword(loginRequest.Password, Convert.FromBase64String(user.Salt));
            //if (hashedPassword != user.PasswordHash)
            //{
            //    return Unauthorized("Invalid email or password.");
            //}
            // Don't return password hash and salt
            user.PasswordHash = string.Empty;
            user.Password = string.Empty;
            user.Salt = string.Empty;
            return Ok(user);
        }
        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }
    }
}
