from PIL import Image
import io

def compress_image(input_bytes, to_format="jpg", quality=80):
    """Convert and compress image to desired format."""
    with Image.open(io.BytesIO(input_bytes)) as img:
        output = io.BytesIO()
        save_kwargs = {"format": to_format.upper()}
        if to_format.lower() in ["jpg", "jpeg", "webp", "avif"]:
            save_kwargs["quality"] = quality
        img.save(output, **save_kwargs)
        return output.getvalue()

def image_to_image(input_bytes, to_format="jpg", quality=80):
    """Convert image format and compress."""
    return compress_image(input_bytes, to_format, quality)