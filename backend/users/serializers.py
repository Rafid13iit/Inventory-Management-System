from rest_framework import serializers  # Importing serializers from Django REST Framework (DRF). 
# DRF serializers are used to convert complex data types (like Django models) into JSON, which can be sent over APIs, 
# and vice versa (deserialize JSON into Python objects).

from django.contrib.auth import get_user_model  # get_user_model is a Django helper function to get the User model.
# By default, Django provides a User model for authentication, but it can be customized. 
# Using get_user_model ensures compatibility with custom User models.

from django.contrib.auth.password_validation import validate_password  # This is a built-in Django function to validate passwords.
# It ensures that passwords meet certain security criteria (e.g., length, complexity). 
# You can customize password validation rules in Django settings.

# Get the User model (default or custom) using get_user_model.
User = get_user_model()

# Serializer for retrieving and displaying user data.
class UserSerializer(serializers.ModelSerializer):  # ModelSerializer is a DRF class that automatically generates fields based on a model.
    # It simplifies the process of creating serializers for Django models.

    class Meta:  # Meta class is used to define metadata for the serializer.
        model = User  # Specifies the model to use (in this case, the User model).
        fields = ['id', 'username', 'email', 'role']  # Fields to include in the serialized output.
        # 'id' is a primary key, 'username' and 'email' are standard fields in the User model, 
        # and 'role' is likely a custom field added to the User model.
        read_only_fields = ['id']  # Specifies that the 'id' field is read-only (cannot be modified by the user).

# Serializer for creating new users.
class UserCreateSerializer(serializers.ModelSerializer):  
    # This serializer is used for user registration. It includes password validation and creation logic.

    # Define the password field with write-only access and validation.
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    # write_only=True ensures that the password is not included in the serialized output (e.g., API responses).
    # validate_password ensures that the password meets security requirements.

    # Define a second password field for confirmation.
    password2 = serializers.CharField(write_only=True, required=True)
    # This is a common practice in user registration forms to confirm the password.

    class Meta:
        model = User  # Specifies the User model.
        fields = ('username', 'email', 'password', 'password2', 'role')  # Fields to include in the serializer.

    # Custom validation logic for the serializer.
    def validate(self, attrs):
        # Check if the two password fields match.
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}  # Raise a validation error if passwords don't match.
            )
        return attrs  # Return the validated data.

    # Custom create method to handle user creation.
    def create(self, validated_data):
        # Remove the 'password2' field from the validated data (it's not needed for user creation).
        validated_data.pop('password2')
        # Create a new user using the create_user method of the User model.
        # create_user is a built-in method that handles password hashing and user creation.
        user = User.objects.create_user(**validated_data)
        return user  # Return the created user.

# **Explanation of Workflow:**
# 1. When a user registers, the `UserCreateSerializer` is used to validate the input data (e.g., username, email, passwords).
# 2. The `validate` method ensures that the passwords match.
# 3. The `create` method creates a new user using the validated data, ensuring the password is hashed securely.
# 4. For retrieving user data (e.g., in a user profile API), the `UserSerializer` is used to serialize the User model.

# **Best Practices:**
# - Always use `get_user_model` instead of directly importing the User model to ensure compatibility with custom User models.
# - Use `validate_password` to enforce strong password policies.
# - Keep sensitive fields like passwords write-only to prevent them from being exposed in API responses.
# - Use `create_user` or `set_password` to handle password hashing instead of manually hashing passwords.

# **Alternatives:**
# - If you need more control over user creation, you can override the `create_user` method in the custom User model.
# - For more complex user registration workflows (e.g., email verification), consider using third-party packages like `django-allauth` or `dj-rest-auth`.

# **Related Concepts:**
# - **Django Models:** Represent database tables. The User model is a built-in Django model for authentication.
# - **Django Views:** Handle HTTP requests and responses. In this case, views would use these serializers to process user data.
# - **Django REST Framework:** A powerful toolkit for building APIs in Django. Serializers are a core feature of DRF.
# - **Password Hashing:** Django automatically hashes passwords using a secure algorithm (e.g., PBKDF2) when you use `create_user` or `set_password`.
# - **Custom User Models:** If you need additional fields (like `role`), you can extend the default User model or create a custom User model.

# This code is a good starting point for user authentication and registration in a Django REST API.