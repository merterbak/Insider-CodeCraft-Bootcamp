# Debugging

## Hata 1: Sepet Öğelerinin Hizalanması
Sepetteki ürün değerleri düzgün hizalanmıyordu. cart-item'ın spanını flex: 1 yapınca düzeldi.
## Hata 2: Stok Hatası
Kod, ürünün stok miktarı istenilen miktara eşit olduğunda bile "Yetersiz stok!" hatası veriyordu. Bu durum, son ürünün satın alınamamasına sebep oluyordu. Bu sorunu çözmek için karşılaştırma operatörünü <=  yerine < olarak değiştirdim. 
## Hata 3: Stok Azaltma İşlemi
Ürün sepete eklendiğinde stok miktarı azaltılmıyordu. Bu sorunu çözmek için addItem metoduna ürün eklendikten sonra "product.stock -= quantity" şeklinde bir kod ekledim. Böylece ürün sepete eklendiğinde stok miktarı otomatik olarak azalacak.
## Hata 4: Toplam Fiyat Hesaplama
Toplam fiyat hesaplanırken ürün adedi (quantity) çarpımı unutulmuştu. Kod sadece ürün fiyatını toplama ekliyordu. Bu sorunu çözmek için reduce fonksiyonu içindeki hesaplamayı "sum + (item.price * item.quantity)" şeklinde değiştirdim.
## Hata 5: İndirim Hesaplama
İndirim uygulanırken kod "this.total *= 0.1" şeklinde yazıldığı için toplam tutarın sadece %10'u kalıyordu. Bu sorunu çözmek için kodu "this.total *= 0.9" olarak değiştirdim.
## Hata 6: Stok İadesi
Sepetten ürün çıkarıldığında, kaç adet olursa olsun stoğa sadece 1 adet iade ediliyordu. Bu sorunu çözmek için kodu "product.stock += item.quantity" şeklinde değiştirdim. Böylece sepetten çıkarılan ürün adedi kadar stok miktarı geri ekleniyor.
## Hata 7: Hata Mesajı Birikimi
Hata mesajları birikiyor  Kod "errorElement.textContent += message + '\n'" şeklinde yazıldığı için her hata bir öncekinin yanına ekleniyordu. Bu sorunu çözmek için kodu "errorElement.textContent = message" olarak değiştirdim. 
## Hata 8: Gereksiz Parametre
"addToCart" metodu çağrılırken gereksiz bir "undefined" parametresi gönderiliyordu. 
## Hata 9: Ondalık Gösterimi
Fiyatlar ondalık kısım olmadan gösteriliyordu. Tüm fiyat gösterimlerine "toFixed(2)" ekleyerek iki basamaklı ondalık kısım gösterilmesini sağladım.

