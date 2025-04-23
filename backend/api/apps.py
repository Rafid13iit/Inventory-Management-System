from django.apps import AppConfig
# This imports the `AppConfig` class from Django's `apps` module.
# `AppConfig` is a base class provided by Django to configure application-specific settings.
# Every Django app has an `AppConfig` class that defines metadata about the app, such as its name.
# Related Concept: Django Project vs App
# - A Django **project** is the overall web application, which can contain multiple **apps**.
# - An **app** is a modular component of your project, designed to perform a specific function (e.g., a blog, an API, or user authentication).
# - Apps are reusable and can be shared across projects.

class ApiConfig(AppConfig):
    # This defines a custom configuration class for the `api` app.
    # By inheriting from `AppConfig`, you can customize the behavior of your app.

    default_auto_field = 'django.db.models.BigAutoField'
    # This specifies the default type of primary key field for models in this app.
    # `BigAutoField` is an integer field that automatically increments and can store very large numbers.
    # Related Concept: Primary Keys in Django Models
    # - Every model in Django requires a primary key, which uniquely identifies each record in the database.
    # - By default, Django uses `AutoField` (a 32-bit integer) for primary keys.
    # - `BigAutoField` is a 64-bit integer, useful for apps that expect a large number of records.
    # Best Practice: Use `BigAutoField` for new projects to future-proof your database.

    name = 'api'
    # This specifies the name of the app. It must match the directory name of the app.
    # Related Concept: App Discovery in Django
    # - Django discovers apps by looking for their `AppConfig` classes in the `INSTALLED_APPS` setting.
    # - You must add `'api.apps.ApiConfig'` (or simply `'api'`) to the `INSTALLED_APPS` list in your `settings.py` file.
    # - This enables Django to recognize and include the app in the project.

# Workflow:
# 1. When you create a new app using `python manage.py startapp api`, Django automatically generates an `apps.py` file with a default `AppConfig` class.
# 2. Django uses the `AppConfig` class to initialize the app when the project starts.
# 3. The `name` attribute is used to identify the app, and the `default_auto_field` sets the default primary key type for models.

# Alternatives:
# - If you want to customize app behavior further, you can override methods in `AppConfig`, such as:
#   - `ready()`: This method is called when the app is ready. You can use it to run startup code, such as signal registration.
# Example:
# ```python
# class ApiConfig(AppConfig):
#     name = 'api'
#     def ready(self):
#         import api.signals  # Import signals to connect them
# ```

# Best Practices:
# - Use meaningful app names that reflect their purpose (e.g., `blog`, `users`, `api`).
# - Keep apps modular and focused on a single responsibility to make them reusable.
# - Use `BigAutoField` for primary keys in new projects to avoid potential issues with large datasets.