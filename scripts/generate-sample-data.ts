/**
 * Sample Data Generator
 * Creates realistic sample data so the website can be developed and tested
 * without a YouTube API key.
 */

import type { RawVideo } from './fetch-videos';
import { categorizeAllVideos } from './categorize-videos';
import { generateDataFiles } from './generate-data';

const SAMPLE_VIDEOS: Partial<RawVideo>[] = [
  // Bhagavad Gita
  { title: 'Bhagavad Gita Chapter 1 - Arjuna Vishada Yoga', description: 'Detailed discourse on the first chapter of Bhagavad Gita, covering Arjuna\'s dilemma on the battlefield of Kurukshetra.' },
  { title: 'Bhagavad Gita Chapter 2 - Sankhya Yoga', description: 'Krishna explains the eternal nature of the soul and the path of knowledge.' },
  { title: 'Bhagavad Gita Chapter 3 - Karma Yoga', description: 'Understanding the path of selfless action and duty.' },
  { title: 'Bhagavad Gita Chapter 4 - Jnana Yoga', description: 'The yoga of knowledge and the divine descent of God.' },
  { title: 'Bhagavad Gita Chapter 5 - Karma Sannyasa Yoga', description: 'The yoga of renunciation of action.' },
  { title: 'Bhagavad Gita Chapter 6 - Dhyana Yoga', description: 'The practice of meditation and self-control.' },
  { title: 'Bhagavad Gita Chapter 7 - Jnana Vijnana Yoga', description: 'Knowledge of the absolute truth.' },
  { title: 'Bhagavad Gita Chapter 8 - Akshara Brahma Yoga', description: 'The imperishable Brahman.' },
  { title: 'Bhagavad Gita Chapter 9 - Raja Vidya Raja Guhya Yoga', description: 'The most confidential knowledge.' },
  { title: 'Bhagavad Gita Chapter 10 - Vibhuti Yoga', description: 'The opulence of the absolute.' },
  { title: 'Bhagavad Gita Chapter 11 - Vishwarupa Darshana Yoga', description: 'The universal form of the Lord.' },
  { title: 'Bhagavad Gita Chapter 12 - Bhakti Yoga', description: 'Devotional service to the supreme Lord.' },
  // Ramayana
  { title: 'Ramayana - Bala Kanda Part 1', description: 'The birth of Lord Rama and his early childhood in Ayodhya.' },
  { title: 'Ramayana - Bala Kanda Part 2', description: 'Rama and Lakshmana accompany Sage Vishwamitra.' },
  { title: 'Ramayana - Ayodhya Kanda Part 1', description: 'The preparations for Rama\'s coronation and the exile.' },
  { title: 'Ramayana - Ayodhya Kanda Part 2', description: 'Rama leaves for the forest with Sita and Lakshmana.' },
  { title: 'Ramayana - Aranya Kanda Part 1', description: 'Life in the forest and encounters with sages.' },
  { title: 'Ramayana - Sundara Kanda Part 1', description: 'Hanuman\'s journey to Lanka to find Sita.' },
  { title: 'Ramayana - Sundara Kanda Part 2', description: 'Hanuman meets Sita and delivers Rama\'s message.' },
  { title: 'Ramayana - Yuddha Kanda Part 1', description: 'The great battle between Rama and Ravana begins.' },
  // Mahabharata
  { title: 'Mahabharata - Sabha Parva - The Dice Game', description: 'The fateful dice game between Pandavas and Kauravas.' },
  { title: 'Mahabharata - Bhishma on the battlefield of Kurukshetra', description: 'The grand patriarch Bhishma leads the Kaurava army.' },
  { title: 'Mahabharata - Karna\'s Story', description: 'The tragic hero Karna and his unwavering loyalty.' },
  { title: 'Mahabharata - Draupadi\'s Humiliation', description: 'The pivotal moment that set the stage for the great war.' },
  { title: 'Mahabharata - Abhimanyu and the Chakravyuha', description: 'The young warrior\'s heroic stand against impossible odds.' },
  // Upanishads
  { title: 'Isha Upanishad - Complete Commentary', description: 'Verse by verse analysis of the Isha Upanishad.' },
  { title: 'Kena Upanishad - Who is the knower?', description: 'Exploration of the nature of consciousness.' },
  { title: 'Katha Upanishad - Nachiketa\'s Journey', description: 'The dialogue between Nachiketa and Yama about death and immortality.' },
  { title: 'Mandukya Upanishad - The States of Consciousness', description: 'AUM and the four states of awareness.' },
  { title: 'Chandogya Upanishad - Tat Tvam Asi', description: 'The great declaration - That Thou Art.' },
  // Vedas
  { title: 'Rig Veda - Nasadiya Sukta (Creation Hymn)', description: 'The famous hymn of creation from the Rig Veda.' },
  { title: 'Yajur Veda - Shanti Mantra Explanation', description: 'Understanding the peace mantras from Yajur Veda.' },
  { title: 'Sama Veda - Musical Chanting Traditions', description: 'The melodic traditions of Sama Veda chanting.' },
  { title: 'Vedic Chanting - Sri Rudram Chamakam', description: 'Complete chanting of Sri Rudram with meaning.' },
  // Puranas
  { title: 'Srimad Bhagavatam - Krishna Leela Part 1', description: 'The divine pastimes of Lord Krishna from Bhagavata Purana.' },
  { title: 'Vishnu Purana - Creation of the Universe', description: 'Cosmology according to Vishnu Purana.' },
  { title: 'Shiva Purana - The Wedding of Shiva and Parvati', description: 'The auspicious marriage of Lord Shiva.' },
  { title: 'Devi Bhagavata - Glory of the Divine Mother', description: 'The supreme power of Shakti.' },
  { title: 'Garuda Purana - After Death Journey', description: 'What happens after death according to Garuda Purana.' },
  // Stotras
  { title: 'Vishnu Sahasranamam - Complete with Meaning', description: 'The thousand names of Lord Vishnu with detailed explanation.' },
  { title: 'Sri Rudram - Vedic Hymn to Lord Shiva', description: 'Powerful Vedic stotra dedicated to Lord Shiva.' },
  { title: 'Lalitha Sahasranamam - Names of the Divine Mother', description: 'The thousand names of Goddess Lalitha.' },
  { title: 'Hanuman Chalisa - Meaning and Significance', description: 'Complete explanation of the 40 verses dedicated to Lord Hanuman.' },
  { title: 'Ganesha Ashtakam - Eight Verses on Ganesha', description: 'Beautiful prayer to Lord Ganesha, the remover of obstacles.' },
  { title: 'Kanakadhara Stotram - The Golden Rain', description: 'Adi Shankaracharya\'s prayer to Goddess Lakshmi.' },
  { title: 'Shiva Tandava Stotram', description: 'The powerful hymn describing Lord Shiva\'s cosmic dance.' },
  { title: 'Lingashtakam - Eight Verses on the Shiva Linga', description: 'Devotional hymn to the sacred Shiva Linga.' },
  { title: 'Suprabhatam - Morning Prayer', description: 'Early morning devotional prayer to wake the Lord.' },
  // Philosophy
  { title: 'Advaita Vedanta - Introduction to Non-Duality', description: 'Understanding Shankaracharya\'s philosophy of Advaita.' },
  { title: 'Vivekachudamani - The Crest Jewel of Discrimination', description: 'Adi Shankara\'s masterwork on self-knowledge.' },
  { title: 'Atma Bodha - Self Knowledge by Shankaracharya', description: 'A treatise on the knowledge of the Self.' },
  { title: 'Ramanuja\'s Vishishtadvaita Philosophy', description: 'Qualified non-dualism explained.' },
  { title: 'Brahma Sutra - Vedanta Philosophy', description: 'The aphorisms of Brahman explained systematically.' },
  // Yoga & Meditation
  { title: 'Patanjali Yoga Sutra - Chapter 1', description: 'The first chapter on the contemplation of consciousness.' },
  { title: 'Pranayama Techniques for Beginners', description: 'Learn the basic breathing exercises from yoga tradition.' },
  { title: 'Meditation Techniques from Dhyana Yoga', description: 'Practical meditation methods from the yogic tradition.' },
  // Festivals & Rituals
  { title: 'Significance of Navaratri - Nine Nights of Worship', description: 'Understanding the spiritual significance of Navaratri festival.' },
  { title: 'Maha Shivaratri - The Great Night of Shiva', description: 'The story and significance of Shivaratri.' },
  { title: 'Sandhyavandana - Daily Ritual Practice', description: 'The traditional daily worship performed at dawn and dusk.' },
  { title: 'Ekadashi Vrata - Spiritual Significance', description: 'Why observing Ekadashi fasting is spiritually beneficial.' },
  { title: 'Ganesh Chaturthi Celebrations', description: 'The festival celebrating the birth of Lord Ganesha.' },
  // Devotional Music
  { title: 'Annamacharya Keerthana - Bhajans Collection', description: 'Beautiful devotional songs by Annamacharya.' },
  { title: 'Tyagaraja Kriti - Endaro Mahanubhavulu', description: 'The great composition by Saint Tyagaraja.' },
  { title: 'Devotional Bhajan - Om Namah Shivaya', description: 'Melodious bhajan dedicated to Lord Shiva.' },
  // Sanskrit
  { title: 'Sanskrit Subhashitam - Wisdom Verses', description: 'Collection of Sanskrit wisdom verses with meaning.' },
  { title: 'Kalidasa - Meghadutam Part 1', description: 'The Cloud Messenger by the great poet Kalidasa.' },
  // Discourses
  { title: 'Spiritual Discourse - The Purpose of Human Life', description: 'A pravachana on the meaning and purpose of human existence.' },
  { title: 'Commentary on Vivekachudamani Verse 1-10', description: 'Detailed vyakhya on the opening verses of Shankaracharya\'s masterpiece.' },
  // Telugu Videos
  { title: '\u0C30\u0C3E\u0C2E\u0C3E\u0C2F\u0C23\u0C02 - \u0C2C\u0C3E\u0C32\u0C15\u0C3E\u0C02\u0C21 - Telugu Ramayana', description: '\u0C36\u0C4D\u0C30\u0C40\u0C30\u0C3E\u0C2E\u0C41\u0C21\u0C3F \u0C1C\u0C28\u0C4D\u0C2E \u0C35\u0C43\u0C24\u0C4D\u0C24\u0C3E\u0C02\u0C24\u0C02. The birth story of Lord Rama in Telugu.' },
  { title: '\u0C2D\u0C17\u0C35\u0C26\u0C4D\u0C17\u0C40\u0C24 - \u0C05\u0C27\u0C4D\u0C2F\u0C3E\u0C2F\u0C02 1 - Bhagavad Gita in Telugu', description: '\u0C2D\u0C17\u0C35\u0C26\u0C4D\u0C17\u0C40\u0C24 \u0C2E\u0C4A\u0C26\u0C1F\u0C3F \u0C05\u0C27\u0C4D\u0C2F\u0C3E\u0C2F\u0C02. First chapter of Bhagavad Gita in Telugu.' },
  { title: '\u0C35\u0C3F\u0C37\u0C4D\u0C23\u0C41 \u0C38\u0C39\u0C38\u0C4D\u0C30\u0C28\u0C3E\u0C2E\u0C02 - Vishnu Sahasranamam Telugu', description: '\u0C35\u0C3F\u0C37\u0C4D\u0C23\u0C41 \u0C38\u0C39\u0C38\u0C4D\u0C30\u0C28\u0C3E\u0C2E\u0C02 \u0C05\u0C30\u0C4D\u0C25\u0C02\u0C24\u0C4B. Vishnu Sahasranamam with Telugu meaning.' },
  { title: '\u0C2E\u0C39\u0C3E\u0C2D\u0C3E\u0C30\u0C24\u0C02 - \u0C15\u0C30\u0C4D\u0C23\u0C41\u0C21\u0C3F \u0C15\u0C25 - Mahabharata in Telugu', description: '\u0C2E\u0C39\u0C3E\u0C2D\u0C3E\u0C30\u0C24\u0C02\u0C32\u0C4B \u0C15\u0C30\u0C4D\u0C23\u0C41\u0C21\u0C3F \u0C17\u0C3E\u0C25. The story of Karna from Mahabharata in Telugu.' },
  { title: '\u0C09\u0C2A\u0C28\u0C3F\u0C37\u0C24\u0C4D\u0C24\u0C41\u0C32\u0C41 - Upanishads in Telugu', description: '\u0C09\u0C2A\u0C28\u0C3F\u0C37\u0C24\u0C4D\u0C24\u0C41\u0C32 \u0C38\u0C3E\u0C30\u0C3E\u0C02\u0C36\u0C02. Essence of Upanishads in Telugu.' },
  { title: '\u0C2A\u0C41\u0C30\u0C3E\u0C23\u0C3E\u0C32\u0C41 - \u0C2D\u0C3E\u0C17\u0C35\u0C24\u0C02 - Bhagavatam in Telugu', description: '\u0C36\u0C4D\u0C30\u0C40\u0C2E\u0C26\u0C4D \u0C2D\u0C3E\u0C17\u0C35\u0C24\u0C02 \u0C24\u0C46\u0C32\u0C41\u0C17\u0C41\u0C32\u0C4B. Srimad Bhagavatam Telugu discourse.' },
  { title: '\u0C06\u0C27\u0C4D\u0C2F\u0C3E\u0C24\u0C4D\u0C2E\u0C3F\u0C15 \u0C2A\u0C4D\u0C30\u0C35\u0C1A\u0C28\u0C02 - Spiritual Discourse Telugu', description: '\u0C06\u0C24\u0C4D\u0C2E\u0C1C\u0C4D\u0C1E\u0C3E\u0C28\u0C02 \u0C17\u0C41\u0C30\u0C3F\u0C02\u0C1A\u0C3F. Telugu discourse on self-knowledge.' },
  { title: '\u0C39\u0C28\u0C41\u0C2E\u0C3E\u0C28\u0C4D \u0C1A\u0C3E\u0C32\u0C40\u0C38\u0C3E - Hanuman Chalisa Telugu Meaning', description: '\u0C39\u0C28\u0C41\u0C2E\u0C3E\u0C28\u0C4D \u0C1A\u0C3E\u0C32\u0C40\u0C38\u0C3E \u0C05\u0C30\u0C4D\u0C25\u0C02. Hanuman Chalisa with Telugu explanation.' },
  { title: '\u0C28\u0C35\u0C30\u0C3E\u0C24\u0C4D\u0C30\u0C41\u0C32 \u0C2A\u0C4D\u0C30\u0C3E\u0C2E\u0C41\u0C16\u0C4D\u0C2F\u0C02 - Navaratri in Telugu', description: '\u0C28\u0C35\u0C30\u0C3E\u0C24\u0C4D\u0C30\u0C41\u0C32 \u0C35\u0C3F\u0C36\u0C47\u0C37\u0C24. Significance of Navaratri festival in Telugu.' },
];

function generateSampleVideoId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  let result = '';
  for (let i = 0; i < 11; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateDate(index: number): string {
  const base = new Date('2024-01-01');
  base.setDate(base.getDate() + Math.floor(index * 3.5));
  return base.toISOString();
}

function main() {
  console.log('='.repeat(60));
  console.log('  Generating Sample Data');
  console.log('='.repeat(60));

  // Multiply sample data to simulate more videos
  const rawVideos: RawVideo[] = [];
  let index = 0;

  // Use the original samples
  for (const sample of SAMPLE_VIDEOS) {
    rawVideos.push({
      videoId: generateSampleVideoId(),
      title: sample.title || '',
      description: sample.description || '',
      publishedAt: generateDate(index),
      thumbnail: '',
    });
    index++;
  }

  // Generate variations to bulk up the data
  const variations = ['Part 1', 'Part 2', 'Part 3', 'Verse 1-5', 'Verse 6-10', 'Summary', 'Q&A Session', 'Deep Dive'];
  for (const sample of SAMPLE_VIDEOS.slice(0, 40)) {
    for (const variation of variations.slice(0, 3)) {
      rawVideos.push({
        videoId: generateSampleVideoId(),
        title: `${sample.title} - ${variation}`,
        description: `${sample.description} ${variation} continuation.`,
        publishedAt: generateDate(index),
        thumbnail: '',
      });
      index++;
    }
  }

  console.log(`\nGenerated ${rawVideos.length} sample videos`);

  const categorized = categorizeAllVideos(rawVideos);
  generateDataFiles(categorized);

  console.log('\n' + '='.repeat(60));
  console.log('  Sample data generated! Run: npm run dev');
  console.log('='.repeat(60));
}

main();
