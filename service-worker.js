
function Notificationes(){
    console.log("listo")
    Push.create("Hello world!", {
        body: "LOGRADO",
//            timeout: 300,
        lang: 'es',
        tag: 'notify',
        onClick: function () {
            window.location="restorant/administracion-bar/pedidos";
            this.close();
        }
    });
}