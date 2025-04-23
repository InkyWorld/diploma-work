from cloudinary import config
from cloudinary.utils import cloudinary_url
from cloudinary.uploader import upload
from fastapi import HTTPException, UploadFile
from app.core.config import cloudinary_config
from cloudinary.api import delete_resources_by_prefix, delete_folder

class Cloudinary:
    settings = config(
        cloud_name=cloudinary_config.CLOUDINARY_CLOUD_NAME,
        api_key=cloudinary_config.CLOUDINARY_API_KEY,
        api_secret=cloudinary_config.CLOUDINARY_API_SECRET,
        secure=True,
    )
    public_folder = f"users_avatar/"

    async def upload_avatar_to_cloudinary(self, file: UploadFile, user_email: str):
        """
        Uploads an avatar image to Cloudinary and returns the generated URL.

        This function takes an avatar image file, uploads it to Cloudinary under a user-specific folder,
        and returns a URL for the uploaded image with the desired dimensions.

        The upload is performed asynchronously, and the `public_id` and `version` are retrieved from the 
        response to generate a URL for the uploaded image. The URL is resized to 250x250 pixels with "fit" 
        crop settings.

        Args:
            file (UploadFile): The avatar image file to upload.
            user_email (str): The email of the user to organize files in a user-specific folder.

        Returns:
            str: The URL of the uploaded avatar image.

        Raises:
            HTTPException: If the upload fails or `public_id` is not found in the Cloudinary response, 
            a 500 error is raised with a detailed message.

        Example:
            ```python
            result_url = await upload_avatar_to_cloudinary(file, "user@example.com")
            print(result_url)  # Prints the Cloudinary URL of the uploaded image
            ```

        """
        # Завантажуємо файл до Cloudinary
        try:
            upload_result = upload(
                file.file, folder=f"{self.public_folder}{user_email}", overwrite=True
            )

             # Отримання `public_id`
            public_id = upload_result.get("public_id")
            version = upload_result.get("version")

            if not public_id:
                raise HTTPException(status_code=500, detail="Failed to retrieve public_id from Cloudinary")

            # Формування коректного URL
            result_url, _ = cloudinary_url(
                public_id,
                width=250,
                height=250,
                crop="fit",
                version=version
            )

            return result_url
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Failed to upload to Cloudinary: {e}"
            )
        
    async def delete_avatar_from_cloudinary(self, user_email: str):
        """
        Deletes all avatar images from a user-specific folder in Cloudinary.

        Args:
            user_email (str): The user's email to locate their avatar folder.

        Returns:
            dict: A dictionary containing the result of the delete operation.

        Raises:
            HTTPException: If the deletion fails.
        """
        try:
            folder_prefix = f"{self.public_folder}{user_email}"
            deleted_files_result = delete_resources_by_prefix(folder_prefix)
            
            # Delete the empty folder itself
            deleted_folder_result = delete_folder(folder_prefix)

            return {
                "deleted_files": deleted_files_result,
                "deleted_folder": deleted_folder_result
            }
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to delete avatar folder from Cloudinary: {e}"
            )


cloudinary = Cloudinary()