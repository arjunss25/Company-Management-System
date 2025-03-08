serializer.py - class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContractAttachment
        fields = ['id','image']
 
 
class ContractSerializer(serializers.ModelSerializer):
    attachments = AttachmentSerializer(many=True, required=False, source='contractattachment_set')
    client_name = serializers.SerializerMethodField(read_only=True)
    location_name = serializers.SerializerMethodField(read_only=True)
    rate_cardname = serializers.SerializerMethodField(read_only=True)
 
    valid_from = serializers.DateField(format='%d-%m-%Y', input_formats=['%d-%m-%Y', '%Y-%m-%d'])
    valid_till = serializers.DateField(format='%d-%m-%Y', input_formats=['%d-%m-%Y', '%Y-%m-%d'])
 
    class Meta:
        model = ContractModel
        fields = ['id', 'company', 'client', 'location', 'rate_card', 'client_name', 'location_name', 'rate_cardname','contract_no', 'valid_from', 'valid_till', 'contract_status', 'attachments']
        read_only_fields = ['company', 'id', 'client_name', 'location_name', 'rate_cardname', 'contract_status']
 
    def get_client_name(self, obj):
        return obj.client.clientName
 
    def get_location_name(self, obj):
        return obj.location.location_name
 
    def get_rate_cardname(self, obj):
        return obj.rate_card.card_name
   
    def get_attachments(self, obj):
        """
        Fetch all attachment URLs related to this contract.
        """
        request = self.context.get('request')  # Get the request object to generate full URLs
        return [request.build_absolute_uri(attachment.image.url) for attachment in obj.contractattachment_set.all()]
 
    def create(self, validated_data):
        request = self.context.get('request')
 
   
        attachments_data = validated_data.pop('attachments', [])
       
     
        file_attachments = request.FILES.getlist('attachments')
 
     
        if 'company' not in validated_data or validated_data['company'] is None:
            if request.user.is_superuser:
                raise serializers.ValidationError({'company': 'This field is required for superadmins.'})
            else:
                validated_data['company'] = request.user.staffs.company
 
        # Create the Contract instance
        contract = ContractModel.objects.create(**validated_data)
 
     
        for attachment in attachments_data:
            ContractAttachment.objects.create(contract=contract, **attachment)
 
        for file in file_attachments:
            ContractAttachment.objects.create(contract=contract, image=file)
 
        return contract