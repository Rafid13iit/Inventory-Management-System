from django.db import models  # Import Django's ORM (Object-Relational Mapping) models module
from django.conf import settings  # Import settings to access project-wide configurations
from django.utils import timezone  # Import timezone utilities for handling date and time

# Django Concept: Models
# Models in Django are Python classes that define the structure of your database tables.
# Each model corresponds to a table in the database, and each attribute in the model corresponds to a column in the table.
# Django's ORM allows you to interact with the database using Python code instead of raw SQL.

class Category(models.Model):  # Define a model named 'Category', which will map to a database table
    # Django Concept: models.Model
    # By inheriting from `models.Model`, this class becomes a Django model and gains access to ORM features.

    name = models.CharField(max_length=100, unique=True)  
    # models.CharField: A field for storing strings with a maximum length.
    # max_length=100: Limits the length of the string to 100 characters.
    # unique=True: Ensures that no two categories can have the same name in the database.

    description = models.TextField(blank=True)  
    # models.TextField: A field for storing large text.
    # blank=True: Allows this field to be optional (can be left blank in forms).

    created_at = models.DateTimeField(auto_now_add=True)  
    # models.DateTimeField: A field for storing date and time.
    # auto_now_add=True: Automatically sets the field to the current date and time when the object is created.

    updated_at = models.DateTimeField(auto_now=True)  
    # auto_now=True: Automatically updates the field to the current date and time whenever the object is saved.

    class Meta:  
        # Django Concept: Meta Class
        # The Meta class is used to define metadata for the model, such as ordering, verbose names, etc.

        verbose_name_plural = 'Categories'  
        # verbose_name_plural: Specifies the plural name for the model in the admin interface.

        ordering = ['name']  
        # ordering: Specifies the default ordering of query results. Here, results will be ordered alphabetically by the 'name' field.

    def __str__(self):  
        # Django Concept: __str__ Method
        # The __str__ method defines the string representation of the model. This is what will be displayed in the admin interface or when the object is printed.

        return self.name  
        # Returns the name of the category as its string representation.

# Best Practice: Always define a __str__ method for your models to make them more readable in the admin interface and debugging.

class Product(models.Model):  # Define a model named 'Product'
    name = models.CharField(max_length=255)  
    # Similar to the 'name' field in Category, but with a longer max_length.

    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')  
    # Django Concept: ForeignKey
    # A ForeignKey creates a many-to-one relationship. Here, each product belongs to one category.
    # on_delete=models.CASCADE: Deletes all products associated with a category when the category is deleted.
    # related_name='products': Allows reverse access from Category to its related products using 'category.products'.

    price = models.DecimalField(max_digits=10, decimal_places=2)  
    # models.DecimalField: A field for storing decimal numbers, often used for prices.
    # max_digits=10: The total number of digits allowed (including decimal places).
    # decimal_places=2: The number of digits allowed after the decimal point.

    quantity = models.PositiveIntegerField(default=0)  
    # models.PositiveIntegerField: A field for storing positive integers (e.g., stock quantity).
    # default=0: Sets the default value to 0.

    description = models.TextField(blank=True)  
    # Similar to the 'description' field in Category.

    image = models.ImageField(upload_to='products/', blank=True, null=True)  
    # Django Concept: ImageField
    # A field for uploading and storing images.
    # upload_to='products/': Specifies the directory where uploaded images will be stored.
    # blank=True, null=True: Allows this field to be optional.

    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True)  
    # Similar to the fields in Category.

    class Meta:  
        ordering = ['name']  
        # Similar to the Meta class in Category.

    def __str__(self):  
        return self.name  
        # Returns the name of the product as its string representation.

    @property  
    # Django Concept: Property Decorator
    # The @property decorator allows you to define a method that can be accessed like an attribute.

    def is_low_stock(self):  
        # A custom property to check if the product's stock is low.

        threshold = getattr(settings, 'STOCK_THRESHOLD', 5)  
        # getattr: Retrieves the value of 'STOCK_THRESHOLD' from settings. If not defined, defaults to 5.
        # Django Concept: settings
        # The settings module contains project-wide configurations, such as database settings, installed apps, etc.

        return self.quantity <= threshold  
        # Returns True if the quantity is less than or equal to the threshold.

# Best Practice: Use properties for computed fields that don't need to be stored in the database.

class Sale(models.Model):  # Define a model named 'Sale'
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='sales')  
    # Similar to the ForeignKey in Product, but links to the Product model.

    quantity = models.PositiveIntegerField()  
    # Similar to the 'quantity' field in Product.

    unit_price = models.DecimalField(max_digits=10, decimal_places=2)  
    # Similar to the 'price' field in Product.

    total_price = models.DecimalField(max_digits=10, decimal_places=2)  
    # Stores the total price of the sale (calculated as quantity * unit_price).

    sale_date = models.DateTimeField(default=timezone.now)  
    # timezone.now: Sets the default value to the current date and time.

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sales')  
    # Django Concept: AUTH_USER_MODEL
    # Links to the user model defined in settings.AUTH_USER_MODEL (default is 'auth.User').
    # related_name='sales': Allows reverse access from the user to their sales.

    def __str__(self):  
        return f"Sale of {self.product.name} - {self.quantity} units"  
        # Returns a string representation of the sale.

    def save(self, *args, **kwargs):  
        # Django Concept: Overriding the save Method
        # The save method is called whenever a model instance is saved to the database.
        # You can override it to add custom logic before or after saving.

        if not self.pk:  
            # self.pk: Checks if the object already exists in the database.
            # If self.pk is None, the object is being created (not updated).

            self.product.quantity -= self.quantity  
            # Reduces the product's stock by the quantity sold.

            self.product.save()  
            # Saves the updated product to the database.

        self.total_price = self.quantity * self.unit_price  
        # Calculates the total price of the sale.

        super().save(*args, **kwargs)  
        # Calls the parent class's save method to handle the actual saving process.

# Best Practice: Be cautious when overriding the save method. Ensure that your logic doesn't introduce unintended side effects.
# Alternative: Use Django signals (e.g., pre_save, post_save) for similar functionality.