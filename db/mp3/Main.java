import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        // currently supported upto : 9999999;
        String dari = NumberToDariText.toDari(9999109.213);
        System.out.println(dari);
    }
}

class NumberToDariText {
    // level , converter
    private static Map<Integer, LevelConverter> converters = new HashMap<>();

    private static Map<Integer, String> level2 = new HashMap<>();
    private static String[] l1 = new String[] { "صفر", "یک", "دوه", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نوه" };

    public static String toDari(int toDariNumber) {
        String numberString = String.valueOf(toDariNumber);
        String result = converters.get(numberString.length()).convert(numberString);
        return result.trim();
    }

    public static String toDari(Double toDariNumber) {

        // validate
        String[] numbeStrings = String.valueOf(toDariNumber).split("\\.");

        String intPart = converters.get(numbeStrings[0].length()).convert(numbeStrings[0]);
        String decimalPart = convertDecimalPart(numbeStrings[1]);
        String finalStr = intPart + decimalPart;
        return finalStr.trim();
    }

    static {
        initlevel2();

        converters.put(1, (str) -> {
            return l1[Integer.valueOf(str)];
        });

        converters.put(2, (str) -> {
            int key = Integer.valueOf(str);

            if (key == 0)
                return "";

            String l1 = converters.get(1).convert(String.valueOf(str.charAt(1)));// 1 2 3 4 5 6 7 8 9

            if (key < 10)
                return l1;

            if (key < 20 || key % 10 == 0)
                return level2.get(key);

            key = (key / 10) * 10;
            return level2.get(key) + " " + l1;
        });

        // upto 999
        converters.put(3, (str) -> {
            int i = Integer.valueOf(str);
            if (i == 0)
                return "";

            String l10 = converters.get(2).convert(str.substring(1));

            if (i < 100)
                return l10;

            String l1 = converters.get(1).convert(String.valueOf(str.charAt(0)));
            String levelName = "صد";
            return l1 + " " + levelName + " " + l10;
        });

        // upto 9999
        converters.put(4, (str) -> {
            int i = Integer.valueOf(str);
            if (i == 0)
                return "";

            String l100 = converters.get(3).convert(str.substring(1));
            if (i < 1000)
                return l100;

            String l1 = converters.get(1).convert(String.valueOf(str.charAt(0)));
            String levelName = "هزار";
            return l1 + " " + levelName + " " + l100;
        });

        // upto 99 999
        converters.put(5, (str) -> {
            // for next level

            int i = Integer.valueOf(str);
            if (i == 0)
                return "";

            String l1000 = converters.get(3).convert(str.substring(2));
            if (i < 10000)
                return l1000;

            String l10 = converters.get(2).convert(str.substring(0, 2));
            String levelName = "هزار";
            return l10 + " " + levelName + " " + l1000;
        });

        // up to 999 999
        converters.put(6, (str) -> {

            // for next level
            int i = Integer.valueOf(str);
            if (i == 0)
                return "";

            String l10000 = converters.get(3).convert(str.substring(3));
            if (i < 100000)
                return l10000;
            // end of for next level

            String l1000 = converters.get(3).convert(str.substring(0, 3));
            String levelName = "هزار";
            return l1000 + " " + levelName + " " + l10000;
        });

        // up to 9 999 999
        converters.put(7, (str) -> {

            // for next level
            int i = Integer.valueOf(str);
            if (i == 0)
                return "";

            String l100000 = converters.get(6).convert(str.substring(1));
            if (i < 1000000)
                return l100000;
            // end of for next level

            String l1 = converters.get(1).convert(str.substring(0, 1));
            String levelName = "میلیون";
            return l1 + " " + levelName + " " + l100000;
        });

    }

    private static void initlevel2() {
        level2.put(10, "ده");
        level2.put(11, "یازده");
        level2.put(12, "دوازده");
        level2.put(13, "سیزده");
        level2.put(14, "چهارده");
        level2.put(15, "پانزده");
        level2.put(16, "شانزده");
        level2.put(17, "هفده");
        level2.put(18, "هشده");
        level2.put(19, "نوزده");
        level2.put(20, "بیست");
        level2.put(30, "سی");
        level2.put(40, "چهل");
        level2.put(50, "پنجاه");
        level2.put(60, "شست");
        level2.put(70, "هفتاد");
        level2.put(80, "هشتاد");
        level2.put(90, "نود");
    }

    private static String convertDecimalPart(String decimalStr) {
        String result = " عشاریه";
        // start from one in array
        for (int i = 0; i < decimalStr.length(); i++) {
            result = result + " " + converters.get(1).convert(String.valueOf(decimalStr.charAt(i)));
        }
        return result;
    }

    interface LevelConverter {
        String convert(String levelNumber);
    }
}