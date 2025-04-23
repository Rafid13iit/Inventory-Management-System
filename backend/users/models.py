# Importing the base model class from Django's ORM (Object-Relational Mapping) system.
# Django's ORM allows you to interact with the database using Python objects instead of raw SQL queries.
from django.db import models

# Importing the AbstractUser class, which is Django's built-in user model.
# AbstractUser provides fields like username, email, first_name, last_name, etc., and authentication functionality.
# By extending AbstractUser, we can customize the user model to fit our application's needs.
from django.contrib.auth.models import AbstractUser

# Importing a utility function for translating text.
# `gettext_lazy` is used for marking strings as translatable in Django.
# This is useful for supporting multiple languages in your application.
from django.utils.translation import gettext_lazy as _

# Defining a custom user model by extending Django's AbstractUser.
# A custom user model is useful when you need to add additional fields or modify the default behavior of the user model.
class CustomUser(AbstractUser):
    # Defining a nested class for user roles using Django's TextChoices.
    # TextChoices is a helper class for defining choices for a CharField or other fields.
    # It provides a clean way to define constants and their human-readable names.
    class Role(models.TextChoices):
        # Defining two roles: ADMIN and USER.
        # The first value ('ADMIN') is stored in the database, and the second value ('Admin') is the human-readable name.
        ADMIN = 'ADMIN', _('Admin')  # _('Admin') makes the string translatable.
        USER = 'USER', _('User')    # _('User') makes the string translatable.

    # Adding a custom email field to the user model.
    # `unique=True` ensures that no two users can have the same email address.
    # This is important for using email as the primary identifier for authentication.
    email = models.EmailField(_('email address'), unique=True)

    # Adding a role field to store the user's role.
    # `choices=Role.choices` restricts the field to only accept values defined in the Role class.
    # `default=Role.USER` sets the default role to 'USER' if no value is provided.
    role = models.CharField(
        max_length=5,  # The maximum length of the field in the database.
        choices=Role.choices,  # Restricts the field to predefined choices.
        default=Role.USER,  # Sets the default value to 'USER'.
    )

    # Overriding the default username field to use email instead.
    # `USERNAME_FIELD` is used by Django's authentication system to identify users.
    # By default, it is set to 'username', but here we change it to 'email'.
    USERNAME_FIELD = 'email'

    # Specifying additional fields required when creating a superuser.
    # `REQUIRED_FIELDS` is a list of fields that must be provided when using the `createsuperuser` command.
    # Since we use email as the primary identifier, 'username' is added here as a required field.
    REQUIRED_FIELDS = ['username']

    # Defining the string representation of the model.
    # This method is used when you print an instance of the model or display it in the Django admin.
    def __str__(self):
        return self.email  # Returns the email address as the string representation.

    # Adding a property to check if the user is an admin.
    # Properties in Python allow you to define methods that can be accessed like attributes.
    # This property returns True if the user's role is 'ADMIN', otherwise False.
    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN

# **Django Concepts and Best Practices Explained:**

# 1. **Custom User Model**:
#    - In Django, it's recommended to define a custom user model at the start of your project if you anticipate needing custom fields or behavior.
#    - Once a user model is defined, it cannot be easily changed without significant database migrations.
#    - To use this custom user model, you must set `AUTH_USER_MODEL = 'yourapp.CustomUser'` in your settings.py file.

# 2. **TextChoices**:
#    - TextChoices is a clean way to define choices for fields. Alternatives include using tuples directly, but TextChoices is more readable and maintainable.
#    - Example of using tuples:
#      ```python
#      ROLE_CHOICES = [
#          ('ADMIN', 'Admin'),
#          ('USER', 'User'),
#      ]
#      role = models.CharField(max_length=5, choices=ROLE_CHOICES, default='USER')
#      ```

# 3. **Email as Username**:
#    - Using email as the primary identifier is common in modern applications because it is unique and easier for users to remember.
#    - Ensure that `unique=True` is set on the email field to enforce uniqueness at the database level.

# 4. **Translation**:
#    - Use `gettext_lazy` for strings that need to be translated. This is especially important for applications that support multiple languages.
#    - To enable translations, you need to configure Django's internationalization settings.

# 5. **Best Practices**:
#    - Always define a `__str__` method for your models to make them more readable in the admin interface and debugging.
#    - Use properties for computed attributes like `is_admin` to keep your code clean and intuitive.
#    - Keep your models focused on data representation. For complex logic, consider using services or utility functions.

# 6. **Workflow**:
#    - After defining the model, run `python manage.py makemigrations` to create a migration file.
#    - Then, run `python manage.py migrate` to apply the migration and create the corresponding database table.
#    - Register the model in the admin interface (if needed) by creating an admin.py file and using `admin.site.register(CustomUser)`.

# 7. **Alternatives**:
#    - If you don't need a custom user model, you can use Django's default user model (`django.contrib.auth.models.User`).
#    - However, extending AbstractUser or AbstractBaseUser is more flexible for customization.

# Let me know if you'd like further clarification or help with other files!