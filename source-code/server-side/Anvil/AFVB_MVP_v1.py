import anvil.tables as tables
import anvil.tables.query as q
from anvil.tables import app_tables
import anvil.server
import base64

# Upload images as binary data in HTTP
@anvil.server.http_endpoint("/v1/imageUpload")
def imageUploadInDB():
  image_bytes = anvil.server.request.body.get_bytes()
  session_key = anvil.server.request.headers['x-session-key']
  uploaded_image = anvil.BlobMedia(content_type="image/jpeg", content=image_bytes, name=f"{session_key}.jpg")
  app_tables.images.add_row(uploaded_image=uploaded_image)
  responsePayload = {'status':'Image uploaded to app_tables','session_key':session_key}
  return anvil.server.HttpResponse(201, responsePayload)

# Upload images as base64 string encapsulated in JSON data in HTTP
# @anvil.server.http_endpoint("/v1/base64ImageUpload",methods=["POST","OPTIONS"],enable_cors=True)
# def base64ImageUploadInDB():
#   if anvil.server.request.method == 'OPTIONS':
#     r = anvil.server.HttpResponse()
#     r.headers['Access-Control-Allow-Origin'] = '*'
#     r.headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
#     r.headers['Access-Control-Request-Method'] = '*'
#     r.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
#     return r
#   else:
#     print(anvil.server.request.body_json)
#     base64_image_str = anvil.server.request.body_json['image'][0]
#     session_key = anvil.server.request.body_json['session-key']
#     actual_image = base64.b64decode(base64_image_str)
#     uploaded_image_blob = anvil.BlobMedia(content_type="image/jpeg", content=actual_image, name=f"{session_key}.jpg")
#     app_tables.images.add_row(uploaded_image=uploaded_image_blob)  
#     responsePayload = {'status':'Image uploaded to app_tables','session_key':session_key}
#     return anvil.server.HttpResponse(201,responsePayload)

# Testing purpose endpoint
@anvil.server.http_endpoint("/v1/register")
def userRegisteration():
  username = anvil.server.request.body_json['username']
  password = anvil.server.request.body_json['password']
  app_tables.users.add_row(username=username,password=password)
  responsePayload = {'status':'User registered successfully'}
  r = anvil.server.HttpResponse()
  r.headers['Access-Control-Allow-Origin'] = '*'
  r.headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
  r.headers['Access-Control-Request-Method'] = '*'
  r.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'

  return anvil.server.HttpResponse(201,responsePayload)

@anvil.server.http_endpoint("/v1/base64ImageUpload",methods=["POST","OPTIONS"],enable_cors=True)
def base64ImageUploadInDB():
  if anvil.server.request.method == 'OPTIONS':
    r = anvil.server.HttpResponse()
    r.headers['Access-Control-Allow-Origin'] = '*'
    r.headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
    r.headers['Access-Control-Request-Method'] = '*'
    r.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    return r
  else:
    print(anvil.server.request.body_json)
    base64_image_str = anvil.server.request.body_json['Image'][0]
    session_key = anvil.server.request.body_json['Session-Key']
    question = anvil.server.request.body_json['Question']
    actual_image = base64.b64decode(base64_image_str)
    uploaded_image_blob = anvil.BlobMedia(content_type="image/jpeg", content=actual_image, name=f"{session_key}.jpg")
    app_tables.prd_afvb_images.add_row(X_Session_Key=session_key,Image=uploaded_image_blob,Question=question)
    
    #Sending to colab
    score, pred = anvil.server.call('dd', uploaded_image_blob,question)
    responsePayload = {'status':'Image uploaded to app_tables','session_key':session_key,'question':question,'answer':pred[0]}
    return responsePayload

