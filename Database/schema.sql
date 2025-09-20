-- Initial database schema for Property Management Application

-- Create the database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'PropertyManagement')
BEGIN
    CREATE DATABASE PropertyManagement;
END
GO

USE PropertyManagement;
GO

-- Create Users table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Users](
        [UserId] INT IDENTITY(1,1) PRIMARY KEY,
        [FirstName] NVARCHAR(50) NOT NULL,
        [LastName] NVARCHAR(50) NOT NULL,
        [Email] NVARCHAR(100) UNIQUE NOT NULL,
        [PhoneNumber] NVARCHAR(20) NULL,
        [PasswordHash] NVARCHAR(128) NOT NULL,
        [Salt] NVARCHAR(128) NOT NULL,
        [UserType] NVARCHAR(20) NOT NULL CHECK (UserType IN ('Tenant', 'Landlord', 'Admin')),
        [CreatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Create Properties table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Properties]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Properties](
        [PropertyId] INT IDENTITY(1,1) PRIMARY KEY,
        [Name] NVARCHAR(100) NOT NULL,
        [Address] NVARCHAR(200) NOT NULL,
        [City] NVARCHAR(50) NOT NULL,
        [State] NVARCHAR(50) NOT NULL,
        [ZipCode] NVARCHAR(20) NOT NULL,
        [OwnerId] INT NOT NULL,
        [CreatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (OwnerId) REFERENCES Users(UserId)
    );
END
GO

-- Create Units table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Units]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Units](
        [UnitId] INT IDENTITY(1,1) PRIMARY KEY,
        [PropertyId] INT NOT NULL,
        [UnitNumber] NVARCHAR(20) NOT NULL,
        [MonthlyRent] DECIMAL(10, 2) NOT NULL,
        [Bedrooms] INT NOT NULL,
        [Bathrooms] DECIMAL(3, 1) NOT NULL,
        [SquareFeet] INT NOT NULL,
        [IsOccupied] BIT NOT NULL DEFAULT 0,
        [CreatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (PropertyId) REFERENCES Properties(PropertyId)
    );
END
GO

-- Create Leases table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Leases]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Leases](
        [LeaseId] INT IDENTITY(1,1) PRIMARY KEY,
        [UnitId] INT NOT NULL,
        [TenantId] INT NOT NULL,
        [StartDate] DATE NOT NULL,
        [EndDate] DATE NOT NULL,
        [MonthlyRent] DECIMAL(10, 2) NOT NULL,
        [SecurityDeposit] DECIMAL(10, 2) NOT NULL,
        [IsActive] BIT NOT NULL DEFAULT 1,
        [CreatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (UnitId) REFERENCES Units(UnitId),
        FOREIGN KEY (TenantId) REFERENCES Users(UserId)
    );
END
GO

-- Create Tickets table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Tickets]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Tickets](
        [TicketId] INT IDENTITY(1,1) PRIMARY KEY,
        [UnitId] INT NOT NULL,
        [TenantId] INT NOT NULL,
        [Title] NVARCHAR(100) NOT NULL,
        [Description] NVARCHAR(MAX) NOT NULL,
        [Priority] NVARCHAR(20) NOT NULL CHECK (Priority IN ('Low', 'Medium', 'High', 'Emergency')),
        [Status] NVARCHAR(20) NOT NULL CHECK (Status IN ('New', 'Assigned', 'InProgress', 'OnHold', 'Resolved', 'Closed', 'Denied')),
        [CreatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (UnitId) REFERENCES Units(UnitId),
        FOREIGN KEY (TenantId) REFERENCES Users(UserId)
    );
END
GO

-- Create TicketComments table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TicketComments]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TicketComments](
        [CommentId] INT IDENTITY(1,1) PRIMARY KEY,
        [TicketId] INT NOT NULL,
        [UserId] INT NOT NULL,
        [Comment] NVARCHAR(MAX) NOT NULL,
        [CreatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (TicketId) REFERENCES Tickets(TicketId),
        FOREIGN KEY (UserId) REFERENCES Users(UserId)
    );
END
GO

-- Create Payments table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Payments]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Payments](
        [PaymentId] INT IDENTITY(1,1) PRIMARY KEY,
        [LeaseId] INT NOT NULL,
        [Amount] DECIMAL(10, 2) NOT NULL,
        [PaymentDate] DATETIME NOT NULL,
        [PaymentType] NVARCHAR(20) NOT NULL CHECK (PaymentType IN ('Rent', 'LateFee', 'Deposit', 'Other')),
        [PaymentMethod] NVARCHAR(20) NOT NULL CHECK (PaymentMethod IN ('CreditCard', 'BankTransfer', 'Cash', 'Check')),
        [TransactionId] NVARCHAR(100) NULL,
        [Notes] NVARCHAR(MAX) NULL,
        [CreatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (LeaseId) REFERENCES Leases(LeaseId)
    );
END
GO

-- Create Announcements table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Announcements]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Announcements](
        [AnnouncementId] INT IDENTITY(1,1) PRIMARY KEY,
        [PropertyId] INT NULL, -- NULL for system-wide announcements
        [Title] NVARCHAR(100) NOT NULL,
        [Content] NVARCHAR(MAX) NOT NULL,
        [IssuedBy] INT NOT NULL, -- UserId of the person who created the announcement
        [StartDate] DATETIME NOT NULL,
        [EndDate] DATETIME NULL,
        [IsActive] BIT NOT NULL DEFAULT 1,
        [CreatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (PropertyId) REFERENCES Properties(PropertyId),
        FOREIGN KEY (IssuedBy) REFERENCES Users(UserId)
    );
END
GO

-- Create Subscriptions table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Subscriptions]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Subscriptions](
        [SubscriptionId] NVARCHAR(50) PRIMARY KEY,
        [UserId] INT NOT NULL,
        [PlanId] NVARCHAR(50) NOT NULL,
        [PlanName] NVARCHAR(100) NOT NULL,
        [Status] NVARCHAR(20) NOT NULL CHECK (Status IN ('active', 'canceled', 'past_due', 'unpaid', 'pending')),
        [StartDate] DATETIME NOT NULL,
        [EndDate] DATETIME NULL,
        [TrialEndDate] DATETIME NULL,
        [CurrentPeriodStart] DATETIME NOT NULL,
        [CurrentPeriodEnd] DATETIME NOT NULL,
        [CancelAtPeriodEnd] BIT NOT NULL DEFAULT 0,
        [Amount] DECIMAL(10, 2) NOT NULL,
        [Interval] NVARCHAR(10) NOT NULL CHECK (Interval IN ('month', 'year')),
        [PaymentMethodId] NVARCHAR(100) NULL,
        [LastFourDigits] NVARCHAR(4) NULL,
        [CreatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (UserId) REFERENCES Users(UserId)
    );
END
GO

-- Create Invoices table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Invoices]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Invoices](
        [InvoiceId] NVARCHAR(50) PRIMARY KEY,
        [UserId] INT NOT NULL,
        [SubscriptionId] NVARCHAR(50) NOT NULL,
        [Amount] DECIMAL(10, 2) NOT NULL,
        [Status] NVARCHAR(20) NOT NULL CHECK (Status IN ('paid', 'open', 'past_due', 'failed')),
        [Date] DATETIME NOT NULL,
        [PaidDate] DATETIME NULL,
        [ReceiptUrl] NVARCHAR(255) NULL,
        [CreatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (UserId) REFERENCES Users(UserId),
        FOREIGN KEY (SubscriptionId) REFERENCES Subscriptions(SubscriptionId)
    );
END
GO
