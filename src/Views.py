views.py - class AddListContract(generics.ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ContractSerializer  
 
 
    # model_name = "contractmodel"
    # action = "add"
 
    @try_except_wrapper
    def post(self, request, *args, **kwargs):
        # Check if the user is a superadmin
        token = request.headers.get('Authorization', '').split(' ')[1]
       
        if not token:
            return custom404(request, "No token provided.")
 
        try:
            # Decode the token and get the payload
            decoded_token = jwt.decode(token, options={"verify_signature": False})
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.DecodeError:
            raise AuthenticationFailed('Error decoding token')
 
        # Check if the user is a superadmin
        if request.user.is_superuser:
            company_id = decoded_token.get('company_id')  # Get company_id from the token payload
            if not company_id:
                return custom404(request,"Superadmin must specify a company ID in the token.")
        else:
            staff_profile = request.user.staffs  
            company_id = staff_profile.company.id  
 
        mutable_data = request.data.copy()
        mutable_data['company'] = company_id
 
        serializer = self.get_serializer(data=mutable_data, context={'request': request})
 
       
       
        if serializer.is_valid():
            serializer.save(attachments=request.FILES.getlist('attachments'))  # Pass list of files explicitly
            return custom200("Contract added successfully.", serializer.data)
        # Return validation errors if any
        return custom404(request, serializer.errors)