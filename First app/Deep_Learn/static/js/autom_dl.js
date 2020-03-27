$(document).ready(function () {
    // Permet de Loader et afficher un preview de notre image : cf developper.mozilla
    //Existe aussi une version avec JQuery ...
    function previewFile() {
        const preview = document.querySelector('img');
        const file = document.querySelector('input[type=file]').files[0];
        const reader = new FileReader();

        reader.addEventListener("load", function () {
            // Convertion de l'image en string base64
            preview.src = reader.result;
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    $("#imageLoad").change(function () {
        previewFile();
    });

    // On configure le bouton de Prédiction
    $('#boutonPrediction').click(function () {
        var form_data = new FormData($('#fileLoad')[0]);
        //var form_data = JSON.stringify($("#fileLoad").serializeArray());
        console.log(form_data);

        // Ajax + JQuery
        $.ajax({                    // Bizarement il n'y a pas besoin d'utilier JSON.stringify ...
            type: 'POST',
            url: "/deepl/prediction",
            data: form_data,
            //dataType: "json",
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data) {
                console.log(data);             // pour tchéquer si ça à la bonne forme ...

                $('#pred1').text(data.classe[0].nom1 + ' | ' + data.classe[0].score1 + '%');   // Façon de chopper les données JSON
                $('#pred2').text(data.classe[1].nom2 + ' | ' + data.classe[1].score2 + '%');
                console.log('Fini');
            },
        });
    });

});