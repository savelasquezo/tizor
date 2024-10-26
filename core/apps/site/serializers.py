from rest_framework import serializers
import apps.site.models as model

class ImageSliderSerializer(serializers.ModelSerializer):
    
    file = serializers.SerializerMethodField()
    def get_file(self, obj):
        if obj.file:
            return obj.file.url.lstrip('')
        return None

    video = serializers.SerializerMethodField()
    def get_video(self, obj):
        if obj.video:
            return obj.video.url.lstrip('')
        return None

    thumbnail = serializers.SerializerMethodField()
    def get_thumbnail(self, obj):
        if obj.thumbnail:
            return obj.thumbnail.url.lstrip('')
        return None

    class Meta:
        model = model.ImageSlider
        fields = '__all__'

class LinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = model.Link
        fields = '__all__'

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = model.FAQs
        fields = '__all__'

class TizorbankSerializer(serializers.ModelSerializer):

    links = LinkSerializer(many=True, read_only=True, source='link_set')
    images = ImageSliderSerializer(many=True, read_only=True, source='imageslider_set')
    faqs = FAQSerializer(many=True, read_only=True, source='faqs_set') 

    class Meta:
        model = model.Tizorbank
        fields = '__all__'

