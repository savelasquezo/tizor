from rest_framework import serializers
import apps.site.models as model

class ImagenSliderSerializer(serializers.ModelSerializer):
    
    file = serializers.SerializerMethodField()
    def get_file(self, obj):
        if obj.file:
            return obj.file.url.lstrip('')
        return None

    class Meta:
        model = model.ImagenSlider
        fields = '__all__'

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = model.FAQs
        fields = '__all__'

class TizorbankSerializer(serializers.ModelSerializer):
    class Meta:
        model = model.Tizorbank
        fields = '__all__'

