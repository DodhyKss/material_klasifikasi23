// Deskripsi material
const descriptions = {
    "Kalsiboard": "Kalsiboard adalah material bangunan yang terbuat dari campuran kalsium karbonat, serat selulosa, air, dan bahan tambahan lainnya. Bahan ini sering digunakan sebagai alternatif untuk gypsum board dan triplek dalam konstruksi dan desain interior. Kalsiboard memiliki beberapa karakteristik yang membuatnya populer, seperti ringan, kuat, tahan air, dan tahan api. Kalsiboard banyak digunakan dalam berbagai aplikasi kontruksi, termasuk Digunakan untuk plafon rumah dan bangunan komersial. Cocok untuk membuat sekat ruangan, Terdapat jenis kalsiboard yang dirancang khusus untuk dinding luar rumah, Juga digunakan dalam proyek industri seperti papan iklan atau dinding terowongan",
    "Kabel Tray": "Kabel tray adalah sistem pengelolaan kabel yang digunakan untuk menyalurkan dan mendukung kabel listrik, telekomunikasi, dan data dalam gedung atau struktur lainnya. Sistem ini dirancang untuk memberikan dukungan fisik yang aman dan terorganisir bagi kabel-kabel tersebut, serta memudahkan akses dan pemeliharaan. Kabel Tray digunakan untuk mendukung sistem listrik dan telekomunikasi di Gedung perkatoran, pusat perbelanjaan, dan fasilitas industri. Untuk mengelola kabel dalam lingkungan industry yang kompleks, serta digunakan dalam proyek infrastruktur besar seperti bandara, stasiun kereta api, dan Gedung tinggi.",
    "Expanded Metal": "Expended metal adalah material logam besi yang dipotong dan ditarik sehingga membentuk pola anyaman tertentu seperti heksagonal. Penggunaan expanded metal meliputi sektor, seperti konstruksi, otomotif, dan industry.",
    "Baja Ringan Kanal C": "Baja ringan atau Cold Rolled Coll (CRC) merupakan material yang dilapisi dengan alumnium-seng untuk pencegahan korosi. Baja ringan sering digunakan dalam berbagai kontruksi seperti, rangka atap, dinding, dan struktur lainnya.  Baja ringan disebut juga sebagai baja putih karena kualitas dari permukaannya yang baik",
    "Cork Sheet": "Cork sheet adalah lembaran yang terbuat dari bahan alami yang berasal dari kulit pohon cork. Bahan ini dikenal karena sifatnya yang ringan, tahan air, dan biodegradable. Cork sheet sering digunakan dalam berbagai aplikasi, termasuk sebagai penutup botol anggur, bahan isolasi, dan dalam industri kerajinan. Dalam konteks pembangunan, cork sheet digunakan dalam berbagai aplikasi, termasuk panel isolasi, ubin akustik, dan sebagai bahan komposit dalam struktur bangunan. Salah satu penggunaan utama cork sheet adalah sebagai bahan isolasi termal. Cork memiliki konduktivitas termal yang rendah, yang membuatnya sangat efektif dalam mengurangi kehilangan panas dalam bangunan. Penelitian menunjukkan bahwa panel cork yang teragregasi dapat meningkatkan efisiensi energi bangunan dengan mengurangi potensi pemanasan global (GWP)."
};

let model, webcam, labelContainer, maxPredictions;

document.addEventListener("DOMContentLoaded", function() {
    // Automatically initialize the webcam and model
    init();

    // Event listener for snapshot button
    document.getElementById("take-snapshot-btn").addEventListener("click", takeSnapshot);
});

// Load the image model and setup the webcam
async function init() {
    const modelURL = "model.json";
    const metadataURL = "metadata.json";

    // Load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Setup webcam
    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);  // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // Update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// Run the webcam image through the image model
async function predict() {
    // Predict can take in an image, video, or canvas html element
    const prediction = await model.predict(webcam.canvas);

    let highestPrediction = { className: "", probability: 0 };

    // Reset the description display
    document.getElementById("description-container").innerHTML = '';

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;

        // Track the highest prediction
        if (prediction[i].probability > highestPrediction.probability) {
            highestPrediction = { className: prediction[i].className, probability: prediction[i].probability };
        }
    }

    // Display the description for the material with the highest prediction probability
    const materialName = highestPrediction.className;
    const probability = highestPrediction.probability;

    if (probability > 0.5 && descriptions[materialName]) {
        const description = descriptions[materialName];
        const descriptionElement = document.createElement("p");
        const kelebihanKekurangan = document.createElement("div");

        if(materialName == 'Kalsiboard') {
            kelebihanKekurangan.innerHTML = `
                <p class="judul">Kelebihan</p>
                <ul>
                    <li>1.	Kalsiboard memiliki ketahanan yang baik terhadap kelembapan, sehingga cocok untuk digunakan di area basah seperti kamar mandi dan dapur</li>
                    <li>2.	Material ini umumnya memiliki tingkat ketahanan terhadap api yang baik, meskipun perlu memeriksa sertifikasi produk tertentu.</li>
                    <li>3.	Mudah dibentuk dan dipotong, memberikan kebebasan dalam desain interior.</li>
                    <li>4.	Proses pemasangan kalsiboard lebih cepat dibandingkan dengan beberapa jenis bahan bangunan lainnya</li>
                    <li>5.	Kalsiboard dapat didaur ulang dan dibuat dari bahan-bahan alami.</li>
                </ul>
                <p class="judul">Kekurangan</p>
                <ul>
                    <li>1.	Kalsiboard biasanya lebih mahal dibandingkan dengan gypsum board, tergantung pada merek dan kualitasnya</li>
                    <li>2.	Pemasangan kalsiboard memerlukan kerangka penopang untuk menjaga kekuatan dan mencegah keretakan</li>
                    <li>3.	Meskipun kuat, kalsiboard mungkin tidak se-estetik bahan lain seperti gypsum atau kayu</li>
                    <li>4.	Material ini dapat menyusut saat cuaca panas, yang bisa menyebabkan keretakan</li>
                </ul>
            `;

            descriptionElement.innerHTML = `<strong>${materialName}:</strong> ${description}`;
            document.getElementById("description-container").appendChild(descriptionElement);
            document.getElementById("description-container").appendChild(kelebihanKekurangan);
        } else if(materialName == 'Kabel Tray') {
            kelebihanKekurangan.innerHTML = `
                <p class="judul">Kelebihan</p>
                <ul>
                    <li>1.	Kabel tray membantu menjaga kabel tetap teratur dan rapi, mengurangi risiko kerusakan akibat kabel yang berserakan.</li>
                    <li>2.	Desain kabel tray memungkinkan akses mudah untuk pemeliharaan dan penggantian kabel tanpa perlu membongkar dinding atau struktur lainnya.</li>
                    <li>3.	Kabel tray menyediakan ventilasi yang baik, membantu mengurangi panas yang dihasilkan oleh kabel listrik.</li>
                    <li>4.	Sistem ini dapat disesuaikan dengan kebutuhan spesifik proyek, termasuk berabgai ukuran dan konfigurasi.</li>
                    <li>5.	Pemasangan kabel tray relatif cepat dan mudah dibandingkan dengan metode pengelolaan kabel lainnya.</li>
                </ul>
                <p class="judul">Kekurangan</p>
                <ul>
                    <li>1.	Meskipun efisien dalam jangka panjang, biaya awal untuk membeli dan memasang kabel tray bisa cukup tinggi</li>
                    <li>2.	Kabel tray mungkin tidak selalu terlihat menarik, terutama jika dipasangan di area yang terlihat.</li>
                    <li>3.	Kabel tray terbuka dapat membuat kabel lebih rentan terhadap debu dan kotoran, yang dapat mempengaruhi kinerjanya jika tidak dirawat dengan baik.</li>
                </ul>
            `;

            descriptionElement.innerHTML = `<strong>${materialName}:</strong> ${description}`;
            document.getElementById("description-container").appendChild(descriptionElement);
            document.getElementById("description-container").appendChild(kelebihanKekurangan);
        } else if(materialName == 'Expanded Metal') {
            kelebihanKekurangan.innerHTML = `
            <p class="judul">Kelebihan</p>
            <ul>
                <li>1.	Ventilasi : pola berlubang yang dapat berfungsi sebagai ventilasi aliran udara, Cahaya, dan cairan. expended metal biasa ditemukan di pagar, dan pelindung mesin </li>
                <li>2.	Kekuaatan structural : kekuatan pada structuralnya yang tinggi dan memiliki bentuk yang berlubang namun material ini akan tetap menjaga integritasnya </li>
                <li>3.	Tahan Korosi : Jika terbuat dari bahan tahan korosi seperti bahan stainless steel atau aluminium, juga dapat memberikan ketahanan terhadap kondisi lingkungan yang keras </li>
                <li>4.	Keamanan : expanded metal adalah pilihan yang tidak bisa Anda abaikan. Dengan pola berlubangnya, expanded metal bisa menghadirkan penghalang yang sulit ditembus tetapi tetap memberikan visibilitas. Ini menjadikannya pilihan ideal untuk pagar keamanan dan partisi.</li>
            </ul>
            <p class="judul">Kekurangan</p>
            <ul>
                <li>1.	Expanded metal memiliki pola yang khas berupa jaringan berlubang, yang mungkin tidak cocok untuk semua desain atau estetika tertentu</li>
                <li>2.	Expanded metal memiliki harga ekonomis daripada bahan logam lainnya seperti kawat, jala, plat</li>
                <li>3.	Expanded metal dengan lubang yang besar dapat menimbulkan resiko cedera Ketika disimpan ditempat yang dapat dijangkau</li>
            </ul>
            `;

            descriptionElement.innerHTML = `<strong>${materialName}:</strong> ${description}`;
            document.getElementById("description-container").appendChild(descriptionElement);
            document.getElementById("description-container").appendChild(kelebihanKekurangan);
        } else if (materialName == 'Baja Ringan Kanal C') {
            kelebihanKekurangan.innerHTML = `
            <p class="judul">Kelebihan</p>
            <ul>
                <li>1.	Rangka baja ringan tidak dimakan rayap, kualitas kayu yang digunakan dipasaran umumnya memiliki kualitas kebawah atau kurang baik. Oleh karena itu, pemilihan rangka baja ringan merupakan hal yang baik dalam membangun bangunan. </li>
                <li>2.	Baja ringan akan mepercepat durasi waktu pengerjaan bangunan dikarenakan baja ringan sudah siap pasang yang tentunya akan mengehamat waktu</li>
                <li>3.	Baja ringan memiliki struktur yang dapat disesuaikan dengan keadaan geografis di daerah tertentu</li>
                <li>4.	Keamanan : expanded metal adalah pilihan yang tidak bisa Anda abaikan. Dengan pola berlubangnya, expanded metal bisa menghadirkan penghalang yang sulit ditembus tetapi tetap memberikan visibilitas. Ini menjadikannya pilihan ideal untuk pagar keamanan dan partisi.</li>
            </ul>
            <p class="judul">Kekurangan</p>
            <ul>
                <li>1.	Biaya awal yang tinggi</li>
                <li>2.	Rentan teradap angin</li>
                <li>3.	Tampilan estetika </li>
                <li>4.	Risiko konstruksi tidap tepat</li>
            </ul>
            `;

            descriptionElement.innerHTML = `<strong>${materialName}:</strong> ${description}`;
            document.getElementById("description-container").appendChild(descriptionElement);
            document.getElementById("description-container").appendChild(kelebihanKekurangan);
        } else if(materialName == 'Cork Sheet') {
            kelebihanKekurangan.innerHTML = `
            <p class="judul">Kelebihan</p>
            <ul>
                <li>1.	Kelebihan utama dari material ini adalah sifatnya yang ringan, tahan air, dan kemampuan isolasi termal yang baik. </li>
                <li>2.	Cork memiliki struktur seluler yang memberikan sifat mekanik yang unggul, termasuk daya serap energi yang tinggi, yang membuatnya ideal untuk aplikasi yang memerlukan perlindungan terhadap benturan. </li>
                <li>3.	Selain itu, cork juga merupakan bahan yang ramah lingkungan, karena diperoleh dari kulit pohon cork oak yang dapat diperbaharui dan biodegradable.</li>
            </ul>
            <p class="judul">Kekurangan</p>
            <ul>
                <li>1.	Meskipun cork sheet merupakan bahan alami dan terbarukan, proses pengolahannya dapat menghasilkan limbah dan emisi yang berdampak pada lingkungan. </li>
                <li>2.	meskipun gabus memiliki potensi untuk digunakan sebagai biosorben dalam analisis toksikologi, proses ekstraksi dan pengolahan dapat memerlukan energi dan bahan kimia yang tidak ramah lingkungan.</li>
            </ul>
            `;

            descriptionElement.innerHTML = `<strong>${materialName}:</strong> ${description}`;
            document.getElementById("description-container").appendChild(descriptionElement);
            document.getElementById("description-container").appendChild(kelebihanKekurangan);
        }
    } else {
        document.getElementById("description-container").innerHTML = "Material tidak terdeteksi dengan cukup pasti.";
    }
}

// Capture snapshot when clicked
async function takeSnapshot() {
    webcam.stop();  // Stop the webcam temporarily to capture the current frame
    const snapshotCanvas = webcam.canvas;  // Get the current canvas of the webcam
    await predict(snapshotCanvas);  // Run prediction on the snapshot

    // Re-start the webcam after taking the snapshot
    webcam.play();
}

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}
