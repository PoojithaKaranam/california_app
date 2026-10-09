const form = document.getElementById("predictionForm");

const button = document.getElementById("predictBtn");

const result = document.getElementById("result");

const placeholder =
    document.getElementById("resultPlaceholder");

const errorBox =
    document.getElementById("error");

const predictionValue =
    document.getElementById("predictionValue");

const sampleBtn =
    document.getElementById("sampleBtn");



/* SAMPLE PROPERTY */

sampleBtn.addEventListener("click", () => {

    const sample = {

        MedInc: 5.2,

        HouseAge: 28,

        AveRooms: 5.4,

        AveBedrms: 1.1,

        Population: 1200,

        AveOccup: 3.1,

        Latitude: 34.05,

        Longitude: -118.24

    };


    Object.entries(sample).forEach(
        ([key, value]) => {

            const input =
                document.getElementById(key);

            if (input) {

                input.value = value;

            }

        }
    );

});



/* PREDICTION */

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        result.classList.add("hidden");

        placeholder.classList.remove("hidden");

        errorBox.classList.add("hidden");


        button.disabled = true;

        button.classList.add("loading");


        try {

            const formData =
                new FormData(form);

            const params =
                new URLSearchParams();


            for (
                const [key, value]
                of formData.entries()
            ) {

                params.append(key, value);

            }


            const response =
                await fetch(
                    `/predict?${params.toString()}`
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Unable to generate prediction."
                );

            }


            /*
             California Housing target
             is expressed in units of
             $100,000.
            */

            const actualValue =
                Number(data.prediction) * 100000;


            predictionValue.textContent =
                actualValue.toLocaleString(
                    "en-US",
                    {
                        maximumFractionDigits: 0
                    }
                );


            placeholder.classList.add(
                "hidden"
            );


            result.classList.remove(
                "hidden"
            );


        }
        catch(error) {

            errorBox.textContent =
                error.message;

            errorBox.classList.remove(
                "hidden"
            );

        }
        finally {

            button.disabled = false;

            button.classList.remove(
                "loading"
            );

        }

    }
);