// ===================================
// TIMELINE DATA & MODAL
// ===================================
const timelineData = {
    '750': {
        title: '750 M: Berdirinya Daulah Abbasiyah',
        content: 'Setelah memimpin revolusi yang berhasil, Abu al-Abbas As-Saffah dikukuhkan sebagai khalifah pertama Daulah Abbasiyah. Ini menandai berakhirnya kekuasaan Daulah Umayyah dan dimulainya era baru yang berpusat di Irak.'
    },
    '762': {
        title: '762 M: Pendirian Kota Baghdad',
        content: 'Atas perintah Khalifah Al-Mansur, pembangunan ibu kota baru yang monumental, Baghdad, dimulai. Kota ini dirancang dengan arsitektur melingkar yang canggih, menjadikannya pusat pemerintahan, perdagangan, dan intelektual yang tak tertandingi pada masanya.'
    },
    '786': {
        title: '786-809 M: Pendirian Baitul Hikmah',
        content: 'Pada masa pemerintahan Khalifah Harun al-Rasyid, yang merupakan puncak keemasan, cikal bakal Baitul Hikmah (Rumah Kebijaksanaan) didirikan. Awalnya sebagai perpustakaan pribadi khalifah, lembaga ini menjadi fondasi bagi revolusi ilmu pengetahuan.'
    },
    '813': {
        title: '813-833 M: Pengembangan Baitul Hikmah',
        content: 'Khalifah Al-Ma\'mun, seorang pecinta ilmu, mengembangkan Baitul Hikmah menjadi akademi ilmu pengetahuan terbesar di dunia. Lembaga ini menjadi pusat penerjemahan karya-karya kuno dari Yunani, Persia, dan India, serta tempat berkumpulnya para ilmuwan terhebat.'
    },
    '847': {
        title: '847-861 M: Pembatasan Penerjemahan Filsafat Yunani',
        content: 'Masa Khalifah Al-Mutawakkil menandai adanya perubahan kebijakan. Dukungan terhadap pemikiran filsafat dan rasionalis mulai dibatasi, menandakan pergeseran fokus intelektual di dalam kekhalifahan.'
    },
    '1258': {
        title: '1258 M: Invasi Bangsa Mongol',
        content: 'Setelah berabad-abad mengalami kemunduran, kota Baghdad dikepung dan dihancurkan oleh pasukan Mongol di bawah pimpinan Hulagu Khan. Peristiwa tragis ini membakar habis Baitul Hikmah dan menandai akhir dari kekuasaan Daulah Abbasiyah di Baghdad.'
    }
};

// Initialize timeline modal if on timeline page
if (document.querySelector('.timeline')) {
    const timelinePoints = document.querySelectorAll('.timeline-point');
    const modal = document.getElementById('timelineModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.querySelector('.close-modal');

    timelinePoints.forEach(point => {
        point.addEventListener('click', () => {
            const year = point.getAttribute('data-year');
            const data = timelineData[year];

            if (data) {
                modalTitle.textContent = data.title;
                modalContent.textContent = data.content;
                modal.style.display = 'block';
            }
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// ===================================
// DRAG AND DROP GAME
// ===================================
if (document.querySelector('.game-container')) {
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone');

    let draggedElement = null;

    dragItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedElement = e.target;
            e.target.classList.add('dragging');
        });

        item.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');

            if (draggedElement) {
                const scientistId = draggedElement.getAttribute('data-scientist');
                const correctAnswer = zone.getAttribute('data-answer');

                if (scientistId === correctAnswer) {
                    // Correct answer
                    zone.classList.add('correct');
                    zone.innerHTML = '';
                    zone.appendChild(draggedElement.cloneNode(true));
                    draggedElement.style.display = 'none';

                    // Remove draggable from cloned element
                    const cloned = zone.querySelector('.drag-item');
                    cloned.setAttribute('draggable', 'false');
                    cloned.style.cursor = 'default';
                } else {
                    // Incorrect answer
                    zone.classList.add('incorrect');
                    setTimeout(() => {
                        zone.classList.remove('incorrect');
                    }, 500);
                }
            }
        });
    });
}

// ===================================
// QUIZ FUNCTIONALITY
// ===================================
if (document.getElementById('submitQuiz')) {
    const submitBtn = document.getElementById('submitQuiz');

    submitBtn.addEventListener('click', async () => {
        const userName = document.getElementById('userName').value.trim();

        if (!userName) {
            alert('Mohon masukkan nama Anda terlebih dahulu!');
            document.getElementById('userName').focus();
            return;
        }

        // Check if all questions are answered
        const totalQuestions = 10;
        let allAnswered = true;

        for (let i = 1; i <= totalQuestions; i++) {
            const answer = document.querySelector(`input[name="q${i}"]:checked`);
            if (!answer) {
                allAnswered = false;
                break;
            }
        }

        if (!allAnswered) {
            alert('Mohon jawab semua pertanyaan sebelum menyelesaikan kuis!');
            return;
        }

        // Calculate score
        const correctAnswers = {
            q1: 'b',  // Abu al-Abbas As-Saffah
            q2: 'c',  // Baghdad
            q3: 'c',  // Harun al-Rasyid
            q4: 'b',  // Baitul Hikmah
            q5: 'c',  // Al-Khawarizmi
            q6: 'd',  // Invasi Bangsa Mongol
            q7: 'b',  // Kedokteran
            q8: 'c',  // Abbas bin Abdul Muthalib
            q9: 'b',  // Jabir bin Hayyan
            q10: 'b'  // 750 M
        };

        let score = 0;
        for (let i = 1; i <= totalQuestions; i++) {
            const answer = document.querySelector(`input[name="q${i}"]:checked`);
            if (answer && answer.value === correctAnswers[`q${i}`]) {
                score++;
            }
        }

        // Send score to backend
        try {
            const response = await fetch('/api/scores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nama: userName,
                    skor: score
                })
            });

            if (response.ok) {
                // Hide quiz, show result
                document.querySelector('.quiz-container').style.display = 'none';
                document.getElementById('resultContainer').style.display = 'block';
                document.getElementById('scoreDisplay').textContent = `Skor Anda: ${score}/10`;

                // Update message based on score
                const resultMessage = document.getElementById('resultMessage');
                if (score === 10) {
                    resultMessage.textContent = 'Sempurna! Anda menguasai sejarah Daulah Abbasiyah dengan sangat baik!';
                } else if (score >= 7) {
                    resultMessage.textContent = 'Luar biasa! Pengetahuanmu sangat baik. Lihat posisimu di Papan Peringkat!';
                } else if (score >= 5) {
                    resultMessage.textContent = 'Bagus! Terus belajar untuk meningkatkan pemahamanmu.';
                } else {
                    resultMessage.textContent = 'Jangan menyerah! Pelajari kembali materinya dan coba lagi.';
                }

                // Scroll to result
                document.getElementById('resultContainer').scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('Terjadi kesalahan saat menyimpan skor. Silakan coba lagi.');
            }
        } catch (error) {
            console.error('Error submitting score:', error);
            alert('Terjadi kesalahan saat menyimpan skor. Silakan coba lagi.');
        }
    });
}
