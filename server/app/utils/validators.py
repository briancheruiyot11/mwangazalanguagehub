def validate_required_fields(data, fields):
    missing = [field for field in fields if not str(data.get(field, "")).strip()]
    return missing


def validate_content_type(content_type):
    return content_type in ["text", "video"]