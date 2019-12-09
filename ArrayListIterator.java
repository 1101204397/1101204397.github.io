package Day14;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Random;

public class ArrayListIterator {
    public static void main(String[] args) {
        Random random = new Random();
        List<Integer> integers1 = new ArrayList<>();
        ArrayList<Integer> integers2 = new ArrayList<>();
        for (int i = 0; i < 20; i++) {//产生20个随机数
            int i1 = random.nextInt(100);
            if (i1 >= 10) {
                integers1.add(i1);
            } else {
                integers2.add(i1);
            }
        }
        System.out.println(integers1);
        Iterator<Integer> iterator = integers1.iterator();
        System.out.println("大于十的：");
        while (iterator.hasNext()) {
            System.out.print(iterator.next() + "  ");
        }
        System.out.println();
        System.out.println("小于十的");
        Iterator<Integer> iterator1 = integers2.iterator();
        while (iterator1.hasNext()) {
            System.out.print(iterator1.next() + " ");
        }
    }
}
