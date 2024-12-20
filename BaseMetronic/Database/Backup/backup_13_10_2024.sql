USE [CRM]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 10/13/2024 8:04:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Account]    Script Date: 10/13/2024 8:04:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Account](
	[Id] [int] IDENTITY(1001,1) NOT NULL,
	[Active] [bit] NOT NULL,
	[CreatedTime] [datetime2](7) NOT NULL,
	[Email] [nvarchar](max) NOT NULL,
	[FirstName] [nvarchar](max) NOT NULL,
	[FullName] [nvarchar](max) NOT NULL,
	[LastName] [nvarchar](max) NOT NULL,
	[MiddleName] [nvarchar](max) NOT NULL,
	[Password] [nvarchar](max) NOT NULL,
	[Photo] [nvarchar](max) NOT NULL,
	[UserName] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Account] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[APILog]    Script Date: 10/13/2024 8:04:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[APILog](
	[Id] [int] IDENTITY(1001,1) NOT NULL,
	[Title] [nvarchar](max) NOT NULL,
	[Path] [nvarchar](max) NOT NULL,
	[Type] [nvarchar](15) NOT NULL,
	[StatusCode] [int] NOT NULL,
	[AccountId] [int] NULL,
	[Active] [bit] NOT NULL,
	[CreatedTime] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_APILog] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DirectoryItem]    Script Date: 10/13/2024 8:04:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DirectoryItem](
	[Id] [int] IDENTITY(1001,1) NOT NULL,
	[Size] [bigint] NULL,
	[LastModified] [datetime2](7) NULL,
	[Path] [nvarchar](max) NOT NULL,
	[IsDirectory] [bit] NOT NULL,
	[Active] [bit] NOT NULL,
	[CreatedTime] [datetime2](7) NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Description] [nvarchar](500) NULL,
	[AuthorId] [int] NULL,
	[ParentId] [int] NULL,
 CONSTRAINT [PK_DirectoryItem] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20240920111257_init', N'6.0.33')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20240920111432_update_entity_v1.0001', N'6.0.33')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20240922062503_update_entity_v1.0002', N'6.0.33')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20240928072802_update_entity_v1.0003', N'6.0.33')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20240928100807_update_entity_v1.0004', N'6.0.33')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20240929090854_update_entity_v1.0005', N'6.0.33')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20241006100849_update_entity_v1.0006', N'6.0.33')
GO
SET IDENTITY_INSERT [dbo].[Account] ON 

INSERT [dbo].[Account] ([Id], [Active], [CreatedTime], [Email], [FirstName], [FullName], [LastName], [MiddleName], [Password], [Photo], [UserName]) VALUES (1002, 1, CAST(N'2024-09-22T13:49:31.8414763' AS DateTime2), N'taduytung24112000@gmail.com', N'Tạ', N'Tạ Duy Tùng', N'Tùng', N'Duy', N'4100c27b5084695b2cf099eb070ff506aaa0c27dde0374c4b41f89d3d866dae9', N'', N'taduytung24112000@gmail.com')
SET IDENTITY_INSERT [dbo].[Account] OFF
GO
SET IDENTITY_INSERT [dbo].[APILog] ON 

INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1001, N'Thêm mới thư mục thành công!', N'/file-manager/api/add-folder', N'POST', 200, 1002, 1, CAST(N'2024-09-29T16:45:15.1953862' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1002, N'Thêm mới thư mục thành công!', N'/file-manager/api/add-folder', N'POST', 200, 1002, 1, CAST(N'2024-09-29T16:46:38.2394952' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1003, N'Thêm mới thư mục thành công!', N'/file-manager/api/add-folder', N'POST', 200, 1002, 1, CAST(N'2024-09-29T16:47:35.1919867' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1004, N'Thêm mới thư mục thành công!', N'/file-manager/api/add-folder', N'POST', 200, 1002, 1, CAST(N'2024-09-29T16:48:45.3821142' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1005, N'Thêm mới thư mục thành công!', N'/file-manager/api/add-folder', N'POST', 200, 1002, 1, CAST(N'2024-09-29T18:17:47.5021111' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1006, N'Thêm mới thư mục thành công!', N'/file-manager/api/add-folder', N'POST', 200, 1002, 1, CAST(N'2024-09-29T18:19:45.7706529' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1007, N'Thêm mới thư mục thành công!', N'/file-manager/api/add-folder', N'POST', 200, 1002, 1, CAST(N'2024-09-29T18:21:45.2335023' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1008, N'Thêm mới thư mục thành công!', N'/file-manager/api/add-folder', N'POST', 200, 1002, 1, CAST(N'2024-09-29T18:22:46.2215922' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1009, N'Thêm mới thư mục thành công!', N'/file-manager/api/add-folder', N'POST', 200, 1002, 1, CAST(N'2024-09-29T18:23:54.6470659' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1010, N'Thêm mới thư mục thành công!', N'/file-manager/api/add-folder', N'POST', 200, 1002, 1, CAST(N'2024-09-29T18:24:21.8367408' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1011, N'Thêm mới thư mục thành công!', N'/file-manager/api/add-folder', N'POST', 200, 1002, 1, CAST(N'2024-09-29T18:25:20.5613738' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1012, N'BadRequest', N'/file-manager/api/add-folder', N'POST', 400, 1002, 1, CAST(N'2024-09-29T21:40:53.0569127' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1013, N'Thêm mới thư mục thành công!', N'/file-manager/api/add-folder', N'POST', 200, 1002, 1, CAST(N'2024-09-29T21:42:38.0106138' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1014, N'Xóa dữ liệu thành công!', N'/file-manager/api/delete/1010', N'DELETE', 200, 1002, 1, CAST(N'2024-09-29T22:56:17.1066784' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1015, N'Xóa dữ liệu thành công!', N'/file-manager/api/delete/1012', N'DELETE', 200, 1002, 1, CAST(N'2024-09-29T22:56:22.7852755' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1016, N'Xóa dữ liệu thành công!', N'/file-manager/api/delete/1005', N'DELETE', 200, 1002, 1, CAST(N'2024-09-29T22:56:26.3238816' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1017, N'Xóa dữ liệu thành công!', N'/file-manager/api/delete/1007', N'DELETE', 200, 1002, 1, CAST(N'2024-09-29T22:56:29.7489777' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1018, N'Xóa dữ liệu thành công!', N'/file-manager/api/delete/1004', N'DELETE', 200, 1002, 1, CAST(N'2024-09-29T22:56:33.5363968' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1019, N'Xóa dữ liệu thành công!', N'/file-manager/api/delete/1013', N'DELETE', 200, 1002, 1, CAST(N'2024-09-29T22:56:38.0826427' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1020, N'BadRequest', N'/file-manager/api/rename-folder', N'PUT', 400, 1002, 1, CAST(N'2024-09-30T21:00:16.5619964' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1021, N'BadRequest', N'/file-manager/api/rename-folder', N'PUT', 400, 1002, 1, CAST(N'2024-09-30T21:06:47.6081151' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1022, N'BadRequest', N'/file-manager/api/rename-folder', N'PUT', 400, 1002, 1, CAST(N'2024-09-30T21:08:41.3755840' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1023, N'BadRequest', N'/file-manager/api/rename-folder', N'PUT', 400, 1002, 1, CAST(N'2024-09-30T21:09:43.3787418' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1024, N'Đổi tên thư mục thành công!', N'/file-manager/api/rename-folder', N'PUT', 200, 1002, 1, CAST(N'2024-09-30T21:43:30.1174831' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1025, N'Đổi tên thư mục thành công!', N'/file-manager/api/rename-folder', N'PUT', 200, 1002, 1, CAST(N'2024-09-30T21:47:04.1672923' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1026, N'Đổi tên thư mục thành công!', N'/file-manager/api/rename-folder', N'PUT', 200, 1002, 1, CAST(N'2024-09-30T21:47:14.4539297' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1027, N'Đổi tên thư mục thành công!', N'/file-manager/api/rename-folder', N'PUT', 200, 1002, 1, CAST(N'2024-09-30T21:47:47.0945295' AS DateTime2))
INSERT [dbo].[APILog] ([Id], [Title], [Path], [Type], [StatusCode], [AccountId], [Active], [CreatedTime]) VALUES (1028, N'Xóa dữ liệu thành công!', N'/file-manager/api/delete/1011', N'DELETE', 200, 1002, 1, CAST(N'2024-09-30T21:49:41.7397531' AS DateTime2))
SET IDENTITY_INSERT [dbo].[APILog] OFF
GO
SET IDENTITY_INSERT [dbo].[DirectoryItem] ON 

INSERT [dbo].[DirectoryItem] ([Id], [Size], [LastModified], [Path], [IsDirectory], [Active], [CreatedTime], [Name], [Description], [AuthorId], [ParentId]) VALUES (1003, NULL, NULL, N'/media', 1, 1, CAST(N'2024-09-29T16:45:15.0286129' AS DateTime2), N'media', NULL, 1002, NULL)
INSERT [dbo].[DirectoryItem] ([Id], [Size], [LastModified], [Path], [IsDirectory], [Active], [CreatedTime], [Name], [Description], [AuthorId], [ParentId]) VALUES (1004, NULL, NULL, N'/media(1)', 1, 0, CAST(N'2024-09-29T16:46:38.2343161' AS DateTime2), N'media(1)', NULL, 1002, NULL)
INSERT [dbo].[DirectoryItem] ([Id], [Size], [LastModified], [Path], [IsDirectory], [Active], [CreatedTime], [Name], [Description], [AuthorId], [ParentId]) VALUES (1005, NULL, NULL, N'/media (1)', 1, 0, CAST(N'2024-09-29T16:47:35.0287653' AS DateTime2), N'media (1)', NULL, 1002, NULL)
INSERT [dbo].[DirectoryItem] ([Id], [Size], [LastModified], [Path], [IsDirectory], [Active], [CreatedTime], [Name], [Description], [AuthorId], [ParentId]) VALUES (1006, NULL, NULL, N'/product', 1, 1, CAST(N'2024-09-29T16:48:45.3758492' AS DateTime2), N'product', NULL, 1002, NULL)
INSERT [dbo].[DirectoryItem] ([Id], [Size], [LastModified], [Path], [IsDirectory], [Active], [CreatedTime], [Name], [Description], [AuthorId], [ParentId]) VALUES (1007, NULL, NULL, N'/media (2)', 1, 0, CAST(N'2024-09-29T18:17:47.3299781' AS DateTime2), N'media (2)', NULL, 1002, NULL)
INSERT [dbo].[DirectoryItem] ([Id], [Size], [LastModified], [Path], [IsDirectory], [Active], [CreatedTime], [Name], [Description], [AuthorId], [ParentId]) VALUES (1008, NULL, NULL, N'/avatar', 1, 1, CAST(N'2024-09-29T18:19:45.7632992' AS DateTime2), N'avatar', NULL, 1002, NULL)
INSERT [dbo].[DirectoryItem] ([Id], [Size], [LastModified], [Path], [IsDirectory], [Active], [CreatedTime], [Name], [Description], [AuthorId], [ParentId]) VALUES (1009, NULL, NULL, N'/videos', 1, 1, CAST(N'2024-09-29T18:21:45.2278109' AS DateTime2), N'videos', NULL, 1002, NULL)
INSERT [dbo].[DirectoryItem] ([Id], [Size], [LastModified], [Path], [IsDirectory], [Active], [CreatedTime], [Name], [Description], [AuthorId], [ParentId]) VALUES (1010, NULL, NULL, N'/avatar (1)', 1, 0, CAST(N'2024-09-29T18:22:46.2177412' AS DateTime2), N'avatar (1)', NULL, 1002, NULL)
INSERT [dbo].[DirectoryItem] ([Id], [Size], [LastModified], [Path], [IsDirectory], [Active], [CreatedTime], [Name], [Description], [AuthorId], [ParentId]) VALUES (1011, NULL, NULL, N'/tungtd', 1, 0, CAST(N'2024-09-29T18:23:54.6427476' AS DateTime2), N'ta duy ngoc', NULL, 1002, NULL)
INSERT [dbo].[DirectoryItem] ([Id], [Size], [LastModified], [Path], [IsDirectory], [Active], [CreatedTime], [Name], [Description], [AuthorId], [ParentId]) VALUES (1012, NULL, NULL, N'/avatar (2)', 1, 0, CAST(N'2024-09-29T18:24:21.8331761' AS DateTime2), N'avatar (2)', NULL, 1002, NULL)
INSERT [dbo].[DirectoryItem] ([Id], [Size], [LastModified], [Path], [IsDirectory], [Active], [CreatedTime], [Name], [Description], [AuthorId], [ParentId]) VALUES (1013, NULL, NULL, N'/tungtd (1)', 1, 0, CAST(N'2024-09-29T18:25:20.5567891' AS DateTime2), N'tungtd (1)', NULL, 1002, NULL)
INSERT [dbo].[DirectoryItem] ([Id], [Size], [LastModified], [Path], [IsDirectory], [Active], [CreatedTime], [Name], [Description], [AuthorId], [ParentId]) VALUES (1014, NULL, NULL, N'/media/blog', 1, 1, CAST(N'2024-09-29T21:42:37.9005713' AS DateTime2), N'blog', NULL, 1002, 1003)
SET IDENTITY_INSERT [dbo].[DirectoryItem] OFF
GO
ALTER TABLE [dbo].[Account] ADD  DEFAULT (CONVERT([bit],(0))) FOR [Active]
GO
ALTER TABLE [dbo].[Account] ADD  DEFAULT (getdate()) FOR [CreatedTime]
GO
ALTER TABLE [dbo].[Account] ADD  DEFAULT (N'') FOR [Email]
GO
ALTER TABLE [dbo].[Account] ADD  DEFAULT (N'') FOR [FirstName]
GO
ALTER TABLE [dbo].[Account] ADD  DEFAULT (N'') FOR [FullName]
GO
ALTER TABLE [dbo].[Account] ADD  DEFAULT (N'') FOR [LastName]
GO
ALTER TABLE [dbo].[Account] ADD  DEFAULT (N'') FOR [MiddleName]
GO
ALTER TABLE [dbo].[Account] ADD  DEFAULT (N'') FOR [Password]
GO
ALTER TABLE [dbo].[Account] ADD  DEFAULT (N'') FOR [Photo]
GO
ALTER TABLE [dbo].[Account] ADD  DEFAULT (N'') FOR [UserName]
GO
ALTER TABLE [dbo].[APILog] ADD  DEFAULT (CONVERT([bit],(0))) FOR [Active]
GO
ALTER TABLE [dbo].[APILog] ADD  DEFAULT (getdate()) FOR [CreatedTime]
GO
ALTER TABLE [dbo].[DirectoryItem] ADD  DEFAULT (CONVERT([bit],(0))) FOR [Active]
GO
ALTER TABLE [dbo].[DirectoryItem] ADD  DEFAULT (getdate()) FOR [CreatedTime]
GO
ALTER TABLE [dbo].[APILog]  WITH CHECK ADD  CONSTRAINT [FK_APILog_Account_AccountId] FOREIGN KEY([AccountId])
REFERENCES [dbo].[Account] ([Id])
GO
ALTER TABLE [dbo].[APILog] CHECK CONSTRAINT [FK_APILog_Account_AccountId]
GO
ALTER TABLE [dbo].[DirectoryItem]  WITH CHECK ADD  CONSTRAINT [FK_DirectoryItem_Account_AuthorId] FOREIGN KEY([AuthorId])
REFERENCES [dbo].[Account] ([Id])
GO
ALTER TABLE [dbo].[DirectoryItem] CHECK CONSTRAINT [FK_DirectoryItem_Account_AuthorId]
GO
ALTER TABLE [dbo].[DirectoryItem]  WITH CHECK ADD  CONSTRAINT [FK_DirectoryItem_DirectoryItem_ParentId] FOREIGN KEY([ParentId])
REFERENCES [dbo].[DirectoryItem] ([Id])
GO
ALTER TABLE [dbo].[DirectoryItem] CHECK CONSTRAINT [FK_DirectoryItem_DirectoryItem_ParentId]
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Đánh dấu bị xóa' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Account', @level2type=N'COLUMN',@level2name=N'Active'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Ngày tạo' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Account', @level2type=N'COLUMN',@level2name=N'CreatedTime'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Đánh dấu bị xóa' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'APILog', @level2type=N'COLUMN',@level2name=N'Active'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Ngày tạo' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'APILog', @level2type=N'COLUMN',@level2name=N'CreatedTime'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Đánh dấu bị xóa' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'DirectoryItem', @level2type=N'COLUMN',@level2name=N'Active'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Ngày tạo' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'DirectoryItem', @level2type=N'COLUMN',@level2name=N'CreatedTime'
GO
